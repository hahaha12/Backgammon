import AboutBackgammon from "../AboutBackgammon";
import Navbar from "../Navbar";
import { Footer } from "../Footer";
import AboutMe from "../AboutMe";
import Dice3Dv2 from "../Dice3Dv2";
import { Link, Route, Routes } from "react-router-dom";
import { Game } from "./Game";
import { Users } from "./Users";
import ErrorPage from "./error-page";

export function Home() {
        <Routes>
          <Route path="./" element={<Home />}></Route>
          <Route path="./Game" element={<Game />}></Route>
          <Route path="./users" element={<Users />}></Route>
          <Route path="./error-page" element={<ErrorPage />}></Route>
        </Routes>;

  return (
    
      <div className="  w-screen bg-slate-100 ">
        <Navbar title={"SoSep Backgammon"} />
        <div className=" w-screen bg-slate-100  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
          <div className="container m-auto p-1">
            <div className=" sm:w-3/4 bg-white relative  rounded-md p-8 m-auto dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
              <div>
                <h1 className=" text-xl text-black text-center text-clip font-bold  m-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                  Welcome to SoSep Backgammon
                </h1>
                <Dice3Dv2 roll1={3} roll2={4} rotate={true} />
              </div>
              <AboutMe />
            </div>
          </div>
          <div className="container m-auto p-1">
            <div className="sm:w-3/4 bg-white relative  rounded-md text-center p-8 m-auto dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
              <button className="bg-blue-500 hover:bg-blue-800 text-white  font-bold py-2 px-4 rounded disabled:bg-blue-200">
                <Link to="/users">Alright, let's get this party started! </Link>
              </button>
            </div>
          </div>

          <div className="container m-auto p-1 ">
            <div className=" sm:w-3/4 bg-white relative  rounded-md p-8 m-auto dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
              <AboutBackgammon />
            </div>
          </div>
        </div>
        <Footer />
      </div>
   
  );
}