export default function Unauthorized() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold">401 - Unauthorized</h1>
      <p className="mt-2 text-lg">You don't have permission to view this page. Please login to use this function</p>
      <a href="/user" className="mt-4 px-4 py-2 bg-black-2 text-gray-2 rounded-lg shadow-md hover:bg-blue-700 transition">
        Go Home
      </a>
    </div>
  )
}