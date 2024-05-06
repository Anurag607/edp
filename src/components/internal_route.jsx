"use client";

const InternalRoute = ({ children, isAdmin, setIsAdmin }) => {
    const onSubmit = (e) => {
        e.preventDefault();
        if (e.target.passcode.value === 'adas_edp') {
            setIsAdmin(true);
        } else {
            alert('Wrong passcode');
        }
        e.target.passcode.value = '';
    };
    
    if (!isAdmin) {
        return (
            <form
                className="grid place-items-center w-full h-full relative"
                onSubmit={onSubmit}
            >
                <div className="w-full max-w-md">
                <label
                    htmlFor="search-brand"
                    className="block text-sm font-semibold leading-6 text-gray-800"
                >
                    Enter Passcode
                </label>
                <div className="mt-1.5 w-full">
                    <input
                        className="block w-full rounded-md py-2 px-3.5 text-gray-900 border  placeholder:text-gray-400 ring-primary focus:ring-offset-2 focus:ring-2 focus:outline-none duration-200 sm:text-sm sm:leading-6"
                        placeholder="Enter passcode ..."
                        name="passcode"
                    />
                </div>
                <button
                    type="submit"
                    className="ml-auto block max-w-fit mt-3 cursor-pointer justify-center py-2 px-5 shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:brightness-95 focus:outline-none"
                >
                    Submit
                </button>
                </div>
            </form>
        );
    }

  return <>{children}</>;
};

export default InternalRoute;
