

const items = ['Home', 'About', 'Services', 'Portfolio', 'Contact'];

export const StaggeredList: React.FC = () => {
    return <>
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li
            key={item}
            className=" animate-fadeInUp"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'forwards',
            }}
          >
            <div className="bg-gray-800 px-6 py-3 rounded shadow-md">
              {item}
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
}