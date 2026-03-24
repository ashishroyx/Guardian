#  Guardian | AI-Powered Evidence Vault

**Guardian** is a high-fidelity security monitoring and evidence management system. By leveraging **client-side Machine Learning**, it transforms a standard webcam into an intelligent sentinel capable of **real-time object detection**, **person counting**, and **automated evidence logging**.

---

##  Core Features

* **Real-time Edge AI:** On-device object detection using **TensorFlow.js**. Video streams are analyzed locally; private data never leaves your browser.
* **Evidence Vault:** A date-sorted, high-precision gallery of all detected threats with **millisecond-accurate timestamps**.
* **AI Analytics Dashboard:** High-level **24-hour activity density maps** and weekly incident reports powered by **Recharts**.
* **Tamper-Proof Controls:** Bulk-deletion logic (**24h / 7d / 30d**) and individual evidence "Purge" capabilities.
* **Responsive UX:** Fully optimized for **Mobile, Tablet, and Desktop** with a premium "Cinematic Security" aesthetic.
* **Privacy First:** Integrated with **Clerk** for secure authentication and **Supabase RLS** (Row Level Security) to ensure data isolation.

---

##  Tech Stack

* **Core Framework:** [Next.js](https://nextjs.org/) 
* **AI / Machine Learning:** * **TensorFlow.js** (Core Engine)
    * **@tensorflow-models/coco-ssd** (Object Detection Model)
* **Frontend & UI:** * **Tailwind CSS** 
    * **React Webcam** 
    * **Lucide React** 
* **Database & Storage:** * **Supabase** 
    * **Supabase Storage** 
* **Authentication:** * **Clerk** 
* **Data Visualization:** * **Recharts** 

---

##  Getting Started

### 1. Installation

```bash
# Clone the repository
git clone [https://github.com/yourusername/guardian-app.git](https://github.com/yourusername/guardian-app.git)

# Install all necessary dependencies
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd react-webcam lucide-react recharts @supabase/supabase-js @clerk/nextjs
