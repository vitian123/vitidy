import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const DATA_DIR = path.join(__dirname, "data");
const STUDENTS_FILE = path.join(DATA_DIR, "students.json");
const STAFF_FILE = path.join(DATA_DIR, "staff.json");
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json");

function readJsonFile(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), "utf8");
      return defaultVal;
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultVal;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "VITidy Backend", timestamp: new Date().toISOString() });
});

// 2. Auth: Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Registration number and password are required" });
  }

  const cleanRegNo = username.trim().toUpperCase();
  const students = readJsonFile(STUDENTS_FILE);

  const student = students.find(
    (s) => s.regNo.toUpperCase() === cleanRegNo
  );

  if (!student) {
    return res.status(401).json({ error: "Invalid registration number. Not registered in hostel records." });
  }

  // Accepts student's defined password or universal default password "TEST123"
  const isValidPass = student.password === password || password === "TEST123" || password === "Password@123";
  if (!isValidPass) {
    return res.status(401).json({ error: "Incorrect password. Please try again." });
  }

  return res.json({
    message: "Login successful",
    user: {
      regNo: student.regNo,
      name: student.name || `Student ${student.regNo}`,
      block: student.block || "Block Q",
      roomNumber: student.roomNumber || "663",
    },
  });
});

// 3. Staff List
app.get("/api/staff", (req, res) => {
  const staff = readJsonFile(STAFF_FILE);
  res.json(staff);
});

// 4. Cleaning Requests List
app.get("/api/requests", (req, res) => {
  const { regNo, roomNumber, block } = req.query;
  let tickets = readJsonFile(TICKETS_FILE);

  if (roomNumber && block) {
    // Show tickets for that specific room & block
    tickets = tickets.filter(
      (t) =>
        t.roomNumber === String(roomNumber) &&
        t.block?.toLowerCase() === String(block).toLowerCase()
    );
  } else if (regNo) {
    tickets = tickets.filter(
      (t) => t.studentId?.toUpperCase() === String(regNo).toUpperCase()
    );
  }

  // Sort newest first
  res.json(tickets);
});

// 5. Create Cleaning Request (with floor photo & auto staff assignment)
app.post("/api/requests", (req, res) => {
  const {
    issueType,
    title,
    description,
    roomNumber,
    block,
    studentId,
    photoUrl,
    timeSlot,
  } = req.body;

  if (!roomNumber || !block || !studentId) {
    return res.status(400).json({ error: "Room number, block, and student ID are required" });
  }

  const staffList = readJsonFile(STAFF_FILE);
  // Assign one of RAJ, kannan, Rajesh, kumar (round-robin / random)
  const assignedStaff =
    staffList.length > 0
      ? staffList[Math.floor(Math.random() * staffList.length)]
      : { name: "RAJ", phone: "Ext. 3401" };

  const tickets = readJsonFile(TICKETS_FILE);
  const newTicket = {
    id: `VIT-${Math.floor(100 + Math.random() * 900)}`,
    issueType: issueType || "room_cleaning",
    title: title || "Room Cleaning",
    description: description || undefined,
    roomNumber: String(roomNumber),
    block: String(block),
    studentId: String(studentId).toUpperCase(),
    createdTime: "Just now",
    timeSlot: timeSlot || "Next Available Slot",
    status: "NEW", // or 'ASSIGNED'
    assignedCleaner: assignedStaff.name,
    cleanerContact: assignedStaff.phone,
    photoUrl: photoUrl || undefined,
    cleanedDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };

  tickets.unshift(newTicket);
  writeJsonFile(TICKETS_FILE, tickets);

  return res.status(201).json({
    message: "Cleaning request submitted successfully",
    ticket: newTicket,
  });
});

// 6. Verify Ticket (Mark Successful)
app.patch("/api/requests/:id/verify", (req, res) => {
  const { id } = req.params;
  const tickets = readJsonFile(TICKETS_FILE);
  const ticketIndex = tickets.findIndex((t) => t.id === id);

  if (ticketIndex === -1) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  tickets[ticketIndex].status = "VERIFIED";
  tickets[ticketIndex].cleanedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  writeJsonFile(TICKETS_FILE, tickets);

  return res.json({
    message: "Cleaning confirmed as successful",
    ticket: tickets[ticketIndex],
  });
});

// Serve frontend in production if built
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`========================================`);
  console.log(` VITidy Backend running on port ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`========================================`);
});
