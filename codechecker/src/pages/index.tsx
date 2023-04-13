import Head from "next/head";
import Image from "next/image";
// import { type NextPage } from "next";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";
// import { api } from "~/utils/api";
import React, { useState } from "react";
import styles from "./index.module.css";
import favicon from "../../public/favicon.png";

// loading while chat gpt calculates
//  add box to choose language for return values.

export default function Home() {
  const [codeInput, setCodeInput] = useState("");
  const [languages, setLanguages] = useState("Python");
  const [serviceType, setServiceType] = useState("Grade");
  const [result, setResult] = useState([]);

  async function onSubmit(event) {
    // prevent forms to be submitted - not working atm
    event.preventDefault();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeInput, languages: languages, service: serviceType}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      setCodeInput("");
    } catch(error) {
      // error message only on console
      console.error(error);
      // alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>JJ's Coding Tools</title>
        <link href="my-t3-app/public/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image alt="logo" src={favicon} />
        <h3>Insert Code Below!</h3>
        <form onSubmit={onSubmit}>
        <select id="languages" onChange={(e) => setLanguages(e.target.value)} value={languages}>
          <option defaultValue="Python">Python</option>
          <option value="Java">Java</option>
          <option value="Javascript">Javascript</option>
          <option value="OCaml">OCaml</option>
          <option value="SML">SML</option>
        </select>
        <select id="review" onChange={(e) => setServiceType(e.target.value)} value={serviceType}>
          <option defaultValue="Grade">Grade</option>
          <option value="Comment">Comment</option>
        </select>
          <textarea
            name="code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <input type="submit" value="Generate" />
        </form>
        <div className={styles.result}>
          <ul className={styles.resultList}>
            {result.map((str: string, index) => <li key={index} style={{ whiteSpace: "pre-wrap" }}>{str}</li>)}
          </ul>
        </div>
      </main>
    </div>
  );
}
