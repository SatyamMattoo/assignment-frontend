import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Table from "../components/Table";
import SourceCodeModal from "../components/Modal";

const Submissions = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/v1/submission/all`
      );
      setRows(data.submissions);
    } catch (error) {
      toast.error("Problem fetching data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);
  const tableSchema = useCallback(
    (submission, columnKey) => {
      const cellValue = submission[columnKey];
      switch (columnKey) {
        case "username":
          return (
            <p className="text-bold text-sm capitalize text-default-500">
              {submission.user.username}
            </p>
          );
        case "language":
          return (
            <p className="text-bold text-sm capitalize text-default-500 ">
              {submission.language}
            </p>
          );
        case "stdin":
          return (
            <p className="text-bold text-sm text-default-500 ">
              {submission.stdin.length < 1 ? "-" : submission.stdin}
            </p>
          );
        case "stdout":
          return (
            <p className="text-bold text-sm text-default-500">
              {submission.stdout.length < 1 ? "-" : submission.stdout}
            </p>
          );
        case "timeStamp":
          return (
            <p className="text-bold text-sm text-default-500">
              {submission.timestamp.slice(0, 10)} at{" "}
              {submission.timestamp.slice(11, 16)}
            </p>
          );
        case "sourceCode":
          return (
            <p className="text-bold text-sm text-default-500">
              {submission.sourceCode.length > 100
                ? submission.sourceCode.slice(0, 100) + "..."
                : submission.sourceCode}
            </p>
          );
        case "actions":
          return (
            <SourceCodeModal
              code={submission.sourceCode}
              title={"Source code"}
            />
          );
        default:
          return cellValue;
      }
    },
    [rows]
  );
  return (
    <section className="flex justify-center pt-10 min-h-screen bg-black/50">
      <div className="container m-8 md:lg-3/4">
        <h1 className="text-xl font-bold text-center m-4 text-white">
          Submissions
        </h1>
        <Table
          rows={rows}
          tableSchema={tableSchema}
          message={loading ? "Submissions loading" : "No submissions yet!"}
        />
      </div>
    </section>
  );
};

export default Submissions;
