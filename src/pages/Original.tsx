


export const Original: React.FC = () => {
    return <>
    {/* FIXED MENU */}
    <div className='fixed right-0 top-0 h-[100vh] w-[400px] flex items-center justify-center'>
      <div className='flex-col h-[400px] w-full '>
        <nav>
          <ul className='text-6xl '>
          <a href="#section1">  <li className='h-[100px] text-center text-white opacity-30 cursor-pointer hover:opacity-100 transition ease-in-out duration-600'>Section 1</li></a>
          <a href="#section2">  <li className='h-[100px] text-center text-white hover:text-cyan-600 opacity-30 cursor-pointer hover:opacity-100 transition ease-in-out duration-600'>Section 2</li></a>
          <a href="#section3">  <li className='h-[100px] text-center text-white hover:text-emerald-600 opacity-30 cursor-pointer hover:opacity-100 transition ease-in-out duration-600'>Section 3</li></a>
          <a href="#section4">  <li className='h-[100px] text-center text-white hover:text-amber-600 opacity-30 cursor-pointer hover:opacity-100 transition ease-in-out duration-600'>Section 4</li></a>
          <a href="#section5">  <li className='h-[100px] text-center text-white hover:text-fuchsia-600 opacity-30 cursor-pointer hover:opacity-100 transition ease-in-out duration-600'>Section 5</li></a>
          </ul>
        </nav>
      </div>
    </div>
    {/* SECTION 1*/}
    <div id="section1" className='dark h-[100vh] flex items-center justify-center'>
      <div>
      <h1 className='text-white text-8xl'>SECTION 1</h1>
      </div>
    </div>

    {/* SECTION 2*/}
    <div id="section2" className='dark h-[100vh] flex items-center justify-center'>
      <div>
      <h1 className='text-cyan-600 text-8xl'>SECTION 2</h1>
      </div>
    </div>

     {/* SECTION 3*/}
     <div id="section3" className='dark h-[100vh] flex items-center justify-center'>
      <div>
      <h1 className='text-emerald-600 text-8xl'>SECTION 3</h1>
      </div>
    </div>

     {/* SECTION 4*/}
     <div id="section4" className='dark h-[100vh] flex items-center justify-center'>
      <div>
      <h1 className='text-amber-600 text-8xl'>SECTION 4</h1>
      </div>
    </div>

     {/* SECTION 5*/}
     <div id="section5" className='dark h-[100vh] flex items-center justify-center'>
      <div>
      <h1 className='text-fuchsia-600 text-8xl'>SECTION 5</h1>
      </div>
    </div>
    </>
}