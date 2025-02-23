import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Calendar, PaintBucket, BarChart2, Bell, Cloud, Plus, List, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-sky-600 to-cyan-800 text-black">
      <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] flex items-center justify-center">
  <motion.div 
    initial={{ opacity: 0, y: -50 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 1 }}
    className="container px-4 md:px-6"
  >
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter drop-shadow-lg">
      Stay Organized, Stay Productive
    </h1>
    <p className="mx-auto max-w-[700px] text-lg md:text-xl mt-4">
      Manage your tasks effortlessly with our modern To-Do List app.
    </p>
    <div className="mt-6 space-x-4">
      <Button className="bg-cyan-600 hover:bg-cyan-700 shadow-lg" onClick={() => navigate('/todo-list')} >Get Started</Button>
      <Button variant="outline" className="border-black text-black hover:bg-black hover:text-cyan-500">Learn More</Button>
    </div>
  </motion.div>
</section>


        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-white via-gray-100 to-white text-black flex items-center justify-center" >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={<CheckCircle />} title="Task Management" description="Create, edit, and delete tasks easily" />
              <FeatureCard icon={<Calendar />} title="Due Dates & Reminders" description="Never miss a deadline" />
              <FeatureCard icon={<PaintBucket />} title="Categories & Priorities" description="Organize tasks efficiently" />
              <FeatureCard icon={<BarChart2 />} title="Progress Tracking" description="See your task completion status" />
              <FeatureCard icon={<Bell />} title="Notifications" description="Get timely reminders" />
              <FeatureCard icon={<Cloud />} title="Cloud Sync" description="Access tasks from any device" />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#09203f] to-[#537895] text-white flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard number={1} icon={<Plus />} title="Create a Task" description="Add a new task with a title, description, and due date." />
              <StepCard number={2} icon={<List />} title="Organize & Prioritize" description="Sort tasks by priority and category." />
              <StepCard number={3} icon={<Check />} title="Track & Complete" description="Mark tasks as completed and track progress." />
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-white via-gray-100 to-white text-black flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6">About TaskMaster</h2>
            <p className="text-center max-w-2xl mx-auto text-lg">
              TaskMaster is a powerful To-Do List app designed to help you stay organized and boost your productivity.
            </p>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold">Technologies Used</h3>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-cyan-500 text-white rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card className="transition-all hover:shadow-xl bg-gray-900 text-white">
        <CardContent className="p-6 text-center">
          <div className="mb-4 text-cyan-400 text-3xl flex justify-center">{icon}</div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StepCard({ number, icon, title, description }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-cyan-500 text-white p-3 text-3xl flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-200">{description}</p>
    </motion.div>
  )
}
