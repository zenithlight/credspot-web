import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { makeAutoObservable } from "mobx";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useLocation,
} from "react-router-dom";
import { observer } from "mobx-react-lite";
import * as ethers from "ethers";
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Button, Card, Intent, Tabs, Tab, Tag } from "@blueprintjs/core";

const cortexAbi = [
  {
    inputs: [
      {
        internalType: "contract IOpenOracleFramework",
        name: "_oracle",
        type: "address",
      },
      {
        internalType: "contract ISuperfluid",
        name: "_host",
        type: "address",
      },
      {
        internalType: "contract ISuperToken",
        name: "_acceptedSuperToken",
        type: "address",
      },
      {
        internalType: "contract IInstantDistributionAgreementV1",
        name: "_ida",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_purchasePrice",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperToken",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "afterAgreementCreated",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperToken",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "afterAgreementTerminated",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperToken",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "afterAgreementUpdated",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperToken",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "beforeAgreementCreated",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperToken",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "beforeAgreementTerminated",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperToken",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "beforeAgreementUpdated",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_customer",
        type: "address",
      },
    ],
    name: "getPurchased",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_feedIds",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
    ],
    name: "poke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "purchase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

class State {
  gitHubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  gitHubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
  gitHubRedirectUri = process.env.REACT_APP_GITHUB_REDIRECT_URI;

  superfluidResolverAddress = process.env.REACT_APP_RESOLVER_ADDRESS;

  gitHubAccessToken = null;
  gitHubUsername = null;
  address = null;
  signer = null;

  constructor() {
    makeAutoObservable(this);
  }

  async setSigner(signer) {
    try {
      this.address = await signer.getAddress();
      this.signer = signer;
    } catch (e) {
      console.error("web3 error:");
      console.error(e);
    }
  }

  clearSigner() {
    this.signer = null;
    this.address = null;
  }
}

const state = new State();

(async () => {
  const provider = await new ethers.providers.Web3Provider(window.ethereum);

  if (provider.getSigner()) {
    await state.setSigner(provider.getSigner());
  }

  const sf = new SuperfluidSDK.Framework({
    ethers: provider,
    resolverAddress: state.superfluidResolverAddress,
  });
  await sf.initialize();
})();

const GitHubLinker = observer(({ state }) => {
  return state.gitHubUsername === null ? (
    <div>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${state.gitHubClientId}&redirect_uri=${state.gitHubRedirectUri}`}
      >
        <Button icon="link" intent={Intent.PRIMARY}>
          Link GitHub account
        </Button>
      </a>
    </div>
  ) : (
    "GitHub linked! Check Dashboard to view your earned cred."
  );
});

const GitHubHandler = observer(({ state }) => {
  useEffect(async () => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    if (hasCode) {
      const formData = new FormData();
      formData.append("client_id", state.gitHubClientId);
      formData.append("client_secret", state.gitHubClientSecret);
      formData.append("redirect_uri", state.gitHubRedirectUri);
      formData.append("code", url.split("?code=")[1]);

      const accessTokenRequest = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          body: formData,
        }
      );

      const params = new URLSearchParams(await accessTokenRequest.text());
      const accessToken = params.get("access_token");

      const userRequest = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      state.gitHubAccessToken = accessToken;
      state.gitHubUsername = (await userRequest.json()).login;
    }
  });

  return state.gitHubUsername === null ? (
    <div>Loading</div>
  ) : (
    <Redirect to="/prove" />
  );
});

const Prove = observer(({ state }) => {
  const [personalRepoExists, setPersonalRepoExists] = useState(false);
  const [signedPayload, setSignedPayload] = useState(null);
  const [signatureExists, setSignatureExists] = useState(false);

  const checkPersonalRepoExists = async () => {
    const repoRequest = await fetch(
      `https://api.github.com/repos/${state.gitHubUsername}/${state.gitHubUsername}`,
      {
        headers: {
          Authorization: `token ${state.gitHubAccessToken}`,
        },
      }
    );

    if (repoRequest.status === 200) {
      setPersonalRepoExists(true);
    }
  };

  const checkSignatureExists = async () => {
    const signatureRequest = await fetch(
      `https://api.github.com/repos/${state.gitHubUsername}/${state.gitHubUsername}/contents/ethereum-proof.json`,
      {
        headers: {
          Authorization: `token ${state.gitHubAccessToken}`,
        },
      }
    );

    if (signatureRequest.status === 200) {
      setSignatureExists(true);
    }
  };

  const getSignedPayload = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const payload = JSON.stringify({
      ethereumAddress: state.address,
      githubUsername: state.gitHubUsername,
    });

    setSignedPayload(
      JSON.stringify({
        payload: payload,
        signature: await provider.send("personal_sign", [
          state.address,
          payload,
        ]),
      })
    );
  };

  useEffect(async () => {
    if (state.gitHubUsername === null) {
      return;
    }

    await checkPersonalRepoExists();

    if (personalRepoExists) {
      await checkSignatureExists();
    }
  });

  let onboardingStep;
  if (!personalRepoExists) {
    onboardingStep = (
      <div>
        First, create a personal public repository named{" "}
        <code>{`${state.gitHubUsername}`}</code>.
        <br />
        <a href="https://github.com/new" target="_blank">
          <Button icon="rocket-slant">Take me there</Button>
        </a>
        <br />
        <Button
          icon="refresh"
          intent={Intent.PRIMARY}
          onClick={checkPersonalRepoExists}
        >
          Check again
        </Button>
      </div>
    );
  } else if (!signatureExists) {
    if (!signedPayload) {
      onboardingStep = (
        <div>
          Now, sign a message using your wallet to prove that this Ethereum
          address belongs to you.
          <br />
          <Button icon="key" intent={Intent.PRIMARY} onClick={getSignedPayload}>
            Sign message
          </Button>
        </div>
      );
    } else {
      onboardingStep = (
        <div>
          Finally, create a file in your personal repository that contains the
          signed message.
          <br />
          <a
            href={`https://github.com/${state.gitHubUsername}/${
              state.gitHubUsername
            }/new/main?filename=ethereum-proof.json&path=%2F&value=${encodeURIComponent(
              signedPayload
            )}`}
            target="_blank"
          >
            <Button icon="rocket-slant">Take me there</Button>
          </a>
          <br />
          <Button
            icon="refresh"
            intent={Intent.PRIMARY}
            onClick={checkSignatureExists}
          >
            Check again
          </Button>
        </div>
      );
    }
  } else {
    onboardingStep = (
      <div>
        You're all set! Remember, you're verified as long as your signature is
        in the same location in your GitHub repository, so make sure not to
        move, change, or delete it.
        <br />
        <a href="/">
          <Button icon="home">Go back home</Button>
        </a>
      </div>
    );
  }

  return state.gitHubUsername === null ? <Redirect to="/" /> : onboardingStep;
});

const Store = observer(({ state }) => {
  const purchase = async (signer) => {
    const cortex = new ethers.Contract(
      "0x3b63985303D5636F6b60315B45531d176Af2c399",
      cortexAbi
    );
    const connectedCortex = cortex.connect(signer);
    await connectedCortex.purchase();
  };

  const download = async () => {
    const downloadRequest = await fetch("http://localhost:8000/download");
    const downloadUrl = await downloadRequest.text();
    const link = document.createElement("a");
    link.download = "my_amazing_book.txt";
    link.href = downloadUrl;
    link.click();
  };

  return (
    <Card>
      <h2>My Amazing Book</h2>
      <Button
        icon="dollar"
        intent={Intent.SUCCESS}
        onClick={() => purchase(state.signer)}
      >
        Purchase (1 fDAIx)
      </Button>
      <Button icon="cloud-download" onClick={download}>
        Download
      </Button>
    </Card>
  );
});

const DashboardCard = ({ username, address, cred, pending, showWithdraw }) => (
  <Card>
    <div className="bp4-text-large">
      <strong>{username}</strong>
    </div>
    <div className="bp4-text-small bp4-text-muted bp4-monospace-text">
      {address === null ? "Ethereum address not linked" : address}
    </div>
    <div>
      <Tag icon="pie-chart" intent={Intent.SUCCESS} minimal>
        Cred: {cred ? cred.toFixed(3) : "N/A"}
      </Tag>
      <Tag icon="bank-account" intent={Intent.WARNING} minimal>
        Withdrawable Dai: {pending ? pending.toFixed(2) : "N/A"}
      </Tag>
    </div>
    {showWithdraw && (
      <Button icon="import" small minimal intent={Intent.SUCCESS}>
        Withdraw
      </Button>
    )}
  </Card>
);

const Dashboard = observer(({ state }) => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(async () => {
    if (dashboardData !== null) {
      return;
    }

    const dashboardRequest = await fetch("http://localhost:8000/dashboard");
    const dashboardJson = await dashboardRequest.json();
    setDashboardData(dashboardJson);
  });

  if (dashboardData === null) {
    return null;
  }

  return (
    <div>
      {Object.entries(dashboardData).map(([identity, data]) => (
        <DashboardCard
          username={identity}
          address={data.address}
          cred={data.score}
          pending={data.pending}
          showWithdraw={state.address === data.address}
          key={identity}
        />
      ))}
    </div>
  );
});

const Main = () => {
  const location = useLocation();

  return (
    <>
      <h1>CredSpot</h1>
      <App state={state} />
      <Tabs vertical={true} selectedTabId={location.pathname}>
        <Tab id="/">
          <Link to="/">Home</Link>
        </Tab>
        <Tab id="/store">
          <Link to="/store">Store</Link>
        </Tab>
        <Tab id="/dashboard">
          <Link to="/dashboard">Dashboard</Link>
        </Tab>
      </Tabs>
      <Switch>
        <Route path="/store">
          <Store state={state} />
        </Route>
        <Route path="/dashboard">
          <Dashboard state={state} />
        </Route>
        <Route path="/login">
          <GitHubHandler state={state} />
        </Route>
        <Route path="/prove">
          <Prove state={state} />
        </Route>
        <Route path="/">
          <GitHubLinker state={state} />
        </Route>
      </Switch>
    </>
  );
};
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Main />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
