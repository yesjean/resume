
import Generator from './pages/Generator'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 text-center text-xl font-semibold">
        AI 이력서 생성기
      </header>
      <main className="py-8">
        <Generator />
      </main>
    </div>
  )
}

export default App
