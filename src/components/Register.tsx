import { cognitoLoginUrl, clientId } from "../../cognitoConfig";
import axios from "axios";

const Register = async () => {
  
  const API_URL = "http://localhost:8000/api/user";

  const sha256 = async (str: string): Promise<ArrayBuffer> => {
    return await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  };

  const generateNonce = async (): Promise<string> => {
    const hash = await sha256(
      crypto.getRandomValues(new Uint32Array(4)).toString()
    );
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const base64URLEncode = (arrayBuffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return base64String
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const redirectToLogin = async (): Promise<void> => {
    const state = await generateNonce();
    const codeVerifier = await generateNonce();
    sessionStorage.setItem(`codeVerifier-${state}`, codeVerifier);
    const codeChallenge = base64URLEncode(await sha256(codeVerifier));
    // const url = `${cognitoLoginUrl}/login?response_type=code&client_id=${clientId}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=${window.location.origin}`;
    // console.log(url);
    // alert(url);
    window.location.href = `${cognitoLoginUrl}/login?response_type=code&client_id=${clientId}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=http://localhost:5173/Backgammon`;
    // window.location.href =
    //   `https://sosepbackgammon.auth.ca-central-1.amazoncognito.com/login?response_type=code&client_id=35r5v11v77trsrts6b7lmebupn&redirect_uri=http://localhost:5173/Backgammon/signup&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  };

  // document.querySelector("#loginButton")?.addEventListener("click", () => {
  //   redirectToLogin();
  // });

  const init = async (tokens: any): Promise<void> => {
    // console.log(tokens);
    const access_token = tokens.access_token;
    let apiResp: any;
    try {

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      // console.log(response);
      apiResp = response.data;
      // console.log(apiResp);

      if (apiResp.isValid) {
        console.log(`You are signed in as ${apiResp.userName}`); //review
        localStorage.setItem("user", JSON.stringify(apiResp.userName));
        // setMessage(`You are signed in as ${apiResp.userName}`);
        // reload page
        window.location.href = "http://localhost:5173/Backgammon";

      } else {
        `Failed to get userid. Are you logged in with a valid token?`;
      }
      // } catch (error) {
      //   console.log(error);
      // }

      // const refreshStatus: (() => Promise<void>)[] = [];
      // let currentId = 0;
      // const doRefreshStatus = async (): Promise<void> => {
      //   await refreshStatus.reduce(async (memo, fn) => {
      //     await memo;
      //     return fn();
      //   }, Promise.resolve());
      // };

      // const refreshStatusButton = document.querySelector(
      //   "#refreshStatus"
      // ) as HTMLButtonElement;
      // refreshStatusButton.addEventListener("click", async () => {
      //   refreshStatusButton.disabled = true;
      //   await doRefreshStatus();
      //   refreshStatusButton.disabled = false;
      // });

      // await doRefreshStatus();
    } catch (error) {
      console.log(apiResp);
      console.error(error);
    }
  };

  //------------------------------STARTS HERE-------------------------------------
  const searchParams = new URL(location.href).searchParams;

  if (searchParams.get("code") !== null) {
    window.history.replaceState({}, document.title, "/Backgammon/");
    const state = searchParams.get("state");
    const codeVerifier = sessionStorage.getItem(`codeVerifier-${state}`);
    sessionStorage.removeItem(`codeVerifier-${state}`);
    if (codeVerifier === null) {
      throw new Error("Unexpected code");
    }
    const res = await fetch(`${cognitoLoginUrl}/oauth2/token`, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/x-www-form-urlencoded",
      }),
      body: Object.entries({
        grant_type: "authorization_code",
        client_id: clientId,
        code: searchParams.get("code")!,
        code_verifier: codeVerifier,
        // redirect_uri: window.location.origin,
        redirect_uri: "http://localhost:5173/Backgammon",
      })
        .map(([k, v]) => `${k}=${v}`)
        .join("&"),
    });
    if (!res.ok) {
      throw new Error(await res.json());
    }
    const tokens = await res.json();
    localStorage.setItem("tokens", JSON.stringify(tokens));

    init(tokens);
  } else {
    if (localStorage.getItem("tokens")) {
      const tokens = JSON.parse(localStorage.getItem("tokens")!);
      init(tokens);
    } else {
      redirectToLogin();
    }
  }
};

export default Register;
