
const LandingPage = () => {
    return (
        <div className="overflow-hidden font-[Rubik]">
            {/* Navbar */}
            <nav className="fixed top-0 w-full flex justify-between items-center bg-white shadow-md py-2 px-5 z-50">
                <img
                src="/Group 2 anyi[1].png" // Dummy logo
                alt="Logo"
                className="w-10"
                />
                <div className="flex space-x-3">
                <a href="/signin">
                    <button className="h-8 text-sm rounded bg-white border border-gray-400 text-[#5a0b4d] px-4">
                    Sign In
                    </button>
                </a>
                <a href="/signup">
                    <button className="h-8 text-sm rounded bg-[#5a0b4d] text-white px-4">
                    Sign Up
                    </button>
                </a>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="h-[70vh] flex items-center justify-between bg-[#1b496f] text-white px-10 pt-16">
                <div className="max-w-lg">
                <h1 className="text-4xl font-bold leading-tight">
                    THE <br /> IQ QUIZ APP
                </h1>
                <p className="mt-4 text-sm">
                    Where knowledge meets fun. Unlock your inner genius through the
                    ultimate quiz adventure.
                </p>
                <a href="/signin">
                    <button className="mt-5 bg-[#5a0b4d] text-white px-5 py-2 text-sm rounded">
                    Get Started
                    </button>
                </a>
                </div>
                <div className="hidden md:block">
                <img
                    src="/Group 2 anyi[1].png" // Dummy Image
                    alt="Hero Icon"
                    className="opacity-25 w-72"
                />
                </div>
            </header>

            {/* Info Section */}
            <section className="bg-white text-center py-10 px-5">
                <h2 className="text-lg font-bold">Become an IQ Buddy!</h2>
                <p className="text-sm mt-3">
                Test your knowledge with trivia questions across topics. <br />
                Share with friends and unlock achievements as you learn something new
                <br />
                every day with the IQ app. Get ready for a fun and challenging
                quizzing experience!
                </p>
            </section>
        </div>
    );
};

export default LandingPage;
