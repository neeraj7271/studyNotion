import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HightlightText from "../components/core/HomePage/HightlightText";
import CTAButton from "../components/core/HomePage/Button.jsx"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks.jsx";
import Footer from "../components/common/Footer.jsx";



function Home() {
  return (
    <div>
      {/* Section-1 */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between  max-w-maxContent">

        {/* Button */}
        <Link to={"</signup"}>

          <div className="mx-auto rounded-full bg-richblue-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 mt-16 p-1 group drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 hover:scale-95 group-hover:bg-richblack-900">
                <p>Become an Instructor</p>
                <FaArrowRight />
            </div>
          </div>

        </Link>

        {/* Heading */}
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with 
          <HightlightText text={"Coding Text"} />
        </div>
        {/* SubHeading */}
        <div className="w-[90%] text-center text-lg font-bold text-richblack-300 mt-3">
        With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>


        {/* Video */}
        <div className="shadow-blue-200 mx-3 my-7 shadow-[10px_-5px_50px_-5px]">
          <video 
          className="shadow-[20px_20px_rgba(255,255,255)]"
          muted
          loop
          autoPlay
          >
          <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code section 1 */}
        <div>
          <CodeBlocks 
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HightlightText text={"Coding Potential"} />
                with our online courses
              </div>
            }

            subHeading={
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }

            ctabtn1={
              {
                btnText: "try it yourself",
                linkto: "/signup",
                active: true
              }
            }
            ctabtn2={
              {
                btnText: "Learn more",
                linkto: "/login",
                active: false
              }
            }

            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a>\n <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroudGradient={<div className="codeblock1 absolute"></div>}

            codeColor={"text-yellow-25"}
          />
        </div>

        {/* Code section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HightlightText text={"Coding Potential"} />
                with our online courses
              </div>
            }

            subHeading={
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }

            ctabtn1={
              {
                btnText: "try it yourself",
                linkto: "/signup",
                active: true
              }
            }
            ctabtn2={
              {
                btnText: "Learn more",
                linkto: "/login",
                active: false
              }
            }

            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a>\n <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroudGradient={<div className="codeblock2 absolute"></div>}

            codeColor={"text-yellow-25"}
          />
        </div>

      </div>

      {/* Section-2 */}

      {/* Section-3 */}

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Home;
