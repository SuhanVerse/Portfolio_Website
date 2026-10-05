export const projects = [
  {
    slug: "arduino-robot",
    title: "One robot. Several ways to move.",
    short: "All-in-one Arduino Robot",
    category: "Robotics & embedded",
    status: "Hardware prototype",
    image: "arduino",
    caption: "Actual build photograph",
    repo: "All_in_one_Arduino_Robot",
    tags: ["Arduino", "C++", "Sensors"],
    summary:
      "A four-wheel robot combining line following, obstacle avoidance, and manual control through Bluetooth and an IR remote.",
    intro:
      "A small platform for exploring how sensors, firmware, and motor control work together. Different operating modes share the same chassis and a common set of movement commands.",
    problem:
      "Bring several control methods into one approachable Arduino robot instead of building a separate circuit for every experiment.",
    implementation:
      "The firmware reads Bluetooth and IR input, maps commands to movement functions, and switches between manual control, line following and ultrasonic obstacle avoidance. An Android app built with MIT App Inventor provides another control surface.",
    decisions: [
      [
        "A common command path",
        "Bluetooth and IR inputs map to shared movement commands. Mode selection decides which behavior controls the motors.",
      ],
      [
        "Simple sensing",
        "Two IR sensors support line following. A servo-mounted ultrasonic sensor scans for space when an obstacle is detected.",
      ],
      [
        "A practical companion app",
        "The repository includes the App Inventor project and Android package alongside the Arduino sketch. Voice commands come through the phone, rather than an on-device AI model.",
      ],
    ],
    evidence: [
      ["Firmware", "AIOR.ino"],
      ["Build documentation", "README.md"],
      ["Wiring schematic", "schematic.png"],
      ["App Inventor source", "AIOR.aia"],
    ],
    limits:
      "The control code includes blocking delays and fixed thresholds. The current documentation does not establish measured reliability, battery life, or repeatable navigation performance.",
    next: "Measure the behavior across repeated line and obstacle trials, then replace blocking waits with a clearer non-blocking state machine.",
  },
  {
    slug: "visiobot",
    title: "From seeing to navigating.",
    short: "VisioBot",
    category: "Robotics & perception",
    status: "Simulation study",
    image: "visiobot",
    caption: "Concept visualization · Simulation study",
    repo: "visiobot",
    tags: ["ROS 2", "Nav2", "YOLOv8"],
    summary:
      "A differential-drive robotics study connecting navigation, computer vision, and a patrol-to-approach behavior in simulation.",
    intro:
      "VisioBot explores the link between perception and motion: how a robot follows a route, detects a target, hands over control, and returns to its navigation task.",
    problem:
      "Connect waypoint navigation with visual tracking without treating perception and movement as unrelated demonstrations.",
    implementation:
      "The ROS 2 workspace includes a robot description, Gazebo worlds, Nav2 configuration and vision nodes. The capstone controller moves between patrol, visual approach and cooldown states.",
    decisions: [
      [
        "Separate responsibilities",
        "Robot configuration, navigation and vision live in focused ROS 2 packages. This makes the interactions between subsystems explicit.",
      ],
      [
        "An explicit handoff",
        "The capstone cancels the navigation task when a target is acquired and uses visual feedback for approach behavior.",
      ],
      [
        "Simulation as a test bed",
        "Gazebo and ROS tooling provide an environment for iterating on the behavior before making claims about a physical deployment.",
      ],
    ],
    evidence: [
      ["Robot description", "src/visiobot_core/urdf/visiobot.urdf.xacro"],
      ["Navigation configuration", "src/visiobot_core/config/nav2_params.yaml"],
      [
        "Capstone controller",
        "src/visiobot_vision/visiobot_vision/day30_capstone_node.py",
      ],
    ],
    limits:
      "This case study describes the repository implementation, not verified physical autonomy. Bounding-box height is used as a distance proxy in the sampled controller, and measured navigation results are not yet documented here.",
    next: "Record a reproducible simulation run, including target loss and recovery, and evaluate a more reliable distance estimate.",
  },
  {
    slug: "edumentx",
    title: "Finding a tutor, closer to home.",
    short: "EdumentX",
    category: "Software & product",
    status: "App in development",
    image: "edumentx",
    caption: "Concept mockup · Sample content",
    repo: "EdumentX",
    tags: ["React Native", "TypeScript", "Firebase"],
    summary:
      "A tutor-discovery app for Nepal, bringing map-based search, tutor profiles, and enrollment workflows into one mobile experience.",
    intro:
      "EdumentX focuses on a familiar local problem: finding a suitable tutor and understanding the next step. The repository combines student, tutor and administrative flows.",
    problem:
      "Make tutor discovery and enrollment easier to navigate through a coherent mobile experience, with location and subject information close at hand.",
    implementation:
      "React Native screens connect tutor listings, map interactions and enrollment flows with repository-based data access. The codebase includes Firebase integration, mock data sources, messaging and shared interface components.",
    decisions: [
      [
        "A shared visual language",
        "Cream surfaces, forest-green actions and restrained amber accents are defined in reusable design tokens.",
      ],
      [
        "Map and list discovery",
        "The map screen connects tutor markers, filters and preview state. A list remains a useful alternative for scanning information.",
      ],
      [
        "Separate data access",
        "Tutor, enrollment and message repositories keep data operations separate from much of the interface code; mock sources support development.",
      ],
    ],
    evidence: [
      ["Student home", "src/screens/student/StudentHome.tsx"],
      ["Map search", "src/screens/student/MapSearch.tsx"],
      ["Design tokens", "tailwind.config.js"],
      ["Project documentation", "README.md"],
    ],
    limits:
      "The repository demonstrates development work; this page does not claim production adoption or independently verified completion of every feature.",
    next: "Document an end-to-end demo with actual app captures, clarify individual contributions, and test loading, empty, offline and error states.",
  },
  {
    slug: "robovault",
    title: "Software for the robotics lab.",
    short: "RoboVault",
    category: "Backend & systems",
    status: "Academic API project",
    image: "robovault",
    caption: "Concept illustration · API project",
    repo: "RoboVault",
    tags: ["FastAPI", "PostgreSQL", "Docker"],
    summary:
      "An inventory and equipment-lending API for a robotics club, with request, approval, return, and role-based access workflows.",
    intro:
      "RoboVault connects backend engineering to a physical workspace: the components and equipment that people borrow, return and maintain in a robotics lab.",
    problem:
      "Represent equipment availability and lending decisions in a consistent workflow rather than leaving each action as an unrelated inventory update.",
    implementation:
      "FastAPI routes use SQLAlchemy models and a dedicated lending service. The repository includes database migrations, authentication, OCR helpers, automated tests and a CI configuration.",
    decisions: [
      [
        "Business rules in one place",
        "The lending service handles request, approval and return transitions, keeping the rules visible and easier to inspect.",
      ],
      [
        "Roles and permissions",
        "Authentication and role-aware routes distinguish borrowing from administrative actions.",
      ],
      [
        "Reproducible development",
        "Container configuration, migrations and tests provide a foundation for consistent setup and validation.",
      ],
    ],
    evidence: [
      ["Lending service", "app/services/lending.py"],
      ["API routes", "app/api/routes/loans.py"],
      ["Lending tests", "tests/test_lending.py"],
      ["Project documentation", "README.md"],
    ],
    limits:
      "This is an academic backend project, not a shipped dashboard. The team contribution breakdown is not finalized in the README. The presence of tests does not establish production readiness or concurrency guarantees.",
    next: "Document the contribution breakdown, record an API walkthrough and verify simultaneous approval behavior against the database.",
  },
];
