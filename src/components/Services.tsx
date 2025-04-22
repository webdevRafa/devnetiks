
type ServicesProps = {
    activeSection: string;
}

export const Services: React.FC<ServicesProps> = ({ activeSection }) => {
    return <>
    
        <div className="h-[800px]">
            <h1 className={`text-white ${activeSection === 'services' ? 'opacity-100' : 'opacity-0'}`}>this is my texter for services page I am testing the intersection observer</h1>
        </div>
  
    </>
}