import React from "react";
import CTAButton from "../HomePage/Button";
import HightlightText from "./HightlightText";
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from "react-type-animation";

function CodeBlocks({position, heading, subHeading, ctabtn1, ctabtn2, codeblock,backgroudGradient, codeColor}) {
  return (
    <div className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}>

        {/* section 1 */}
        <div className="w-[50%] flex flex-col gap-8">

            {heading}
            <div className="text-richblack-300 font-bold">
                {subHeading}
            </div>

            <div className="flex gap-7 mt-7">

                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className="flex gap-2 items-center">
                        {ctabtn1.btnText}
                        <FaArrowRight />
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    {ctabtn2.btnText}
                </CTAButton>
            </div>
        </div>

        {/* section 2 */}
        <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 w-[100%] relative lg:w-[470px]">
        {backgroudGradient}
            <div className="flex flex-col text-center w-[10%] text-richblue-400 font-inter font-bold">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

            <div className={`flex flex-col gap-2 font-bold font-mono ${codeColor}`}>
                <TypeAnimation
                    sequence={[
                        codeblock, 2000, ""
                    ]}
                    repeat={Infinity}
                    omitDeletionAnimation={true}
                    style={
                        {
                        whiteSpace:"pre-line",
                        display: "block"
                        }
                    }
                 />
            </div>

        </div>

    </div>
  );
}

export default CodeBlocks;
