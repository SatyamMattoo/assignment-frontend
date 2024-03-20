import React, { useRef, useState } from "react";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z.string().min(1),
  codeLanguage: z.string().min(1),
  sourceCode: z.string().min(1),
  stdIn: z.string(),
});

const languageCodeMap = {
  Javascript: "63",
  Python: "71",
  Java: "62",
  "C++": "54",
};

const Home = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [isExecuted, setIsExecuted] = useState(false);

  const handleExecution = async () => {
    const sourceCode = form.current.sourceCode.value;
    const stdIn = form.current.stdIn.value || null;
    const codeLanguage = form.current.codeLanguage.value;

    if (!sourceCode || !codeLanguage) {
      toast.error("Source code and language are required");
      return;
    }
    setLoading(true);

    const options = {
      method: "POST",
      url: `${import.meta.env.VITE_APP_JUDGE_URL}`,
      params: {
        wait: "true",
        fields: "*",
      },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": `${import.meta.env.VITE_APP_JUDGE_API_KEY}`,
        "X-RapidAPI-Host": `${import.meta.env.VITE_APP_JUDGE_HOST}`,
      },
      data: {
        language_id: languageCodeMap[codeLanguage],
        source_code: sourceCode,
        stdin: stdIn,
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data.status.description === "Accepted") {
        clearErrors();
        setIsExecuted(true);
        toast.success("Execution Successful");
        setOutput(response.data.stdout || "");
      } else {
        setError("root", {
          message: response.data.status.description,
        });
        toast.error("Execution Failed!");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Internal Server Error!");
      setLoading(false);
    }
  };

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const input = { ...data, stdOut: output };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/v1/submission/submit`,
        {
          data: input,
        }
      );

      if (response.status === 201) {
        reset();
        setLoading(false);
        toast.success(response.data.message);
      } else {
        toast.error(result.message);
      }
      setIsExecuted(false);
      setLoading(false);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
      toast.error(error.message);
      setLoading(false);
    }
  };
  return (
    <section className="flex justify-center items-center min-h-screen  bg-black/50">
      <div className="container md:lg-3/4 lg:w-1/2 mx-auto">
        <form
          className="flex flex-col gap-1 p-6 lg:p-12 shadow-lg shadow-slate-800 rounded-lg m-6 bg-white"
          onSubmit={handleSubmit(submitHandler)}
          ref={form}
        >
          <h1 className="text-2xl text-center font-bold m-4 text-[#0070f3]">
            Save Your code
          </h1>
          <div className="flex justify-between gap-2 items-center">
            <label className="block mb-2 text-sm font-medium">
              Your Username
              <input
                type="text"
                id="username"
                name="from_username"
                className="shadow-sm outline-none text-sm rounded-lg  block w-full p-2.5 border border-slate-400 my-1"
                placeholder="Take_u_forward"
                {...register("username")}
                required
              />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </label>

            <label className="block mb-2 text-sm font-medium">
              Language
              <select
                id="codeLanguage"
                name="from_codeLanguage"
                className="shadow-sm outline-none text-sm rounded-lg  block w-full p-2.5 border border-slate-400 text-gray-500 my-1"
                {...register("codeLanguage")}
                required
              >
                <option value="">Select a language</option>
                {Object.keys(languageCodeMap).map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              {errors.codeLanguage && (
                <p className="text-xs text-red-500">
                  {errors.codeLanguage.message}
                </p>
              )}
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block m-1 text-sm font-medium">Source Code</label>
            <textarea
              id="sourceCode"
              name="sourceCode"
              rows="6"
              className="shadow-sm outline-none text-sm rounded-lg  block w-full p-2.5 border border-slate-400"
              placeholder={`function greet() {\n  console.log('Hello, world!');\n}\ngreet();`}
              {...register("sourceCode")}
            ></textarea>
            {errors.sourceCode && (
              <p className="text-xs text-red-500">
                {errors.sourceCode.message}
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <label className="block m-1 text-sm font-medium w-full">
              Input
              <textarea
                type="text"
                id="stdIn"
                rows={3}
                name="from_stdIn"
                className="shadow-sm outline-none text-sm rounded-lg  block w-full p-2.5 border border-slate-400 my-1"
                placeholder="Your Standard Input"
                {...register("stdIn")}
              />
              {errors.stdIn && (
                <p className="text-xs text-red-500">{errors.stdIn.message}</p>
              )}
            </label>
            <label className="block m-1 text-sm font-medium w-full">
              Output
              <textarea
                type="text"
                id="stdOut"
                rows={3}
                name="from_stdOut"
                disabled
                value={output}
                className="shadow-sm outline-none text-sm rounded-lg  block w-full p-2.5 border border-slate-400 my-1"
                placeholder="Your output will appear here..."
              />
              {errors.stdOut && (
                <p className="text-xs text-red-500">{errors.stdOut.message}</p>
              )}
            </label>
          </div>
          {errors.root && (
            <p className="text-xs text-red-500">{errors.root.message}</p>
          )}
          <div>
            {!isExecuted ? (
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 disabled:bg-gray-400"
                onClick={handleExecution}
                disabled={loading}
              >
                {loading ? "Compiling..." : "Compile"}
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Home;
