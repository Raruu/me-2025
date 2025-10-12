type Work = {
  title: string;
  img: string[];
  year: number;
  tags: string[];
  desc: string;
  desc_long?: string;
  repo?: string;
  liveProject?: string;
};

export const myWorks: Work[] = [
  {
    title: "ReMagang",
    img: [
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/remagang-sem-4/landing.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/remagang-sem-4/login.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/remagang-sem-4/admin_dashboard.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/remagang-sem-4/user_dashboard.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/remagang-sem-4/user_profile_review.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/remagang-sem-4/profile_edit.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/remagang-sem-4/pick_location.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/remagang-sem-4/user_lowongan.webp",
    ],
    year: 2025,
    tags: ["laravel", "web", "mysql", "php", "html", "css", "js", "bootstrap"],
    desc: "Project for the 4th semester collage",
    desc_long:
      "ReMagang (Internship Recommendation System) is a new (standalone) system that was developed as a digital solution to simplify the process of searching for and managing internships for students in the Information Technology Department at the Malang State Polytechnic.",
    repo: "https://github.com/Raruu/PBL-RekomMagang-Semester-4",
    liveProject: "https://remagang.azurewebsites.net",
  },
  {
    title: "Rokku Peepaa Shizaa",
    img: [
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/rokku_pepa/rokku_pepa_2.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/rokku_pepa/rokku_pepa_1.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/rokku_pepa/rokku_pepa_3.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/rokku_pepa/rokku_pepa_4.webp",
    ],
    year: 2024,
    tags: [
      "flutter",
      "image-classification",
      "machine-learning",
      "yolo",
      "tflite",
      "python",
      "mobile",
      "desktop-app",
      "rock-paper-scissor",
    ],
    desc: "Rock Paper Scissor with Flutter plus Image classification",
    repo: "https://github.com/Raruu/Rokku-Peepaa-Shizaa-Flutter",
  },
  {
    title: "Bebas Tanggungan TA",
    img: [
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/bebas-ta-sem-3/login.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/bebas-ta-sem-3/admin_dashboard.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/bebas-ta-sem-3/admin_acc.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/bebas-ta-sem-3/user_dashboard.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/bebas-ta-sem-3/user_pengumpulan.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/bebas-ta-sem-3/user_pusat.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/bebas-ta-sem-3/user_mobile.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/bebas-ta-sem-3/notif.webp",
    ],
    desc: "Project for the 3th semester collage",
    year: 2024,
    tags: ["php", "web", "sql", "html", "css", "js", "bootstrap"],
    repo: "github.com/Raruu/Sistem-Informasi-Bebas-Tanggungan-TA",
  },
  {
    title: "Flutter RAG Chat",
    img: [
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/flutter_rag_chat/chatting_mobile.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/flutter_rag_chat/chat_list_mobile.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/flutter_rag_chat/chatting.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/flutter_rag_chat/chatting_parameters.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/flutter_rag_chat/chatting_parameters_mobile.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/flutter_rag_chat/rag_context.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/flutter_rag_chat/rag_context_pdf.webp",
    ],
    desc: "Chat app with your documents",
    year: 2024,
    tags: [
      "flutter",
      "RAG",
      "sqlite",
      "machine-learning",
      "python",
      "mobile",
      "desktop-app",
    ],
    repo: "https://github.com/Raruu/Flutter-Chat",
  },
  {
    title: "Batch Cropping Apps",
    img: [
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/batch-cropping-app/menu_batch.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/batch-cropping-app/batch_cropping.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/batch-cropping-app/set_target.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/batch-cropping-app/batch_cropping_edit.webp",
      "https://raw.githubusercontent.com/Raruu/Raruu/refs/heads/main/assets/porto_images/batch-cropping-app/result.webp",
    ],
    year: 2025,
    tags: [
      "flutter",
      "image-recognition",
      "yolo",
      "SAM",
      "clip",
      "machine-learning",
      "python",
      "desktop-app",
    ],
    desc: "Batch cropping apps",
    desc_long: "with YOLO, SAM, and Clip",
  },
];
