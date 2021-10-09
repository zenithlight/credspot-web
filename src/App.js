import * as ethers from "ethers";
import "@blueprintjs/core/lib/css/blueprint.css";
import { observer } from "mobx-react-lite";

import "./App.css";

import { Button, Intent } from "@blueprintjs/core";

const App = observer(({ state }) => (
  <div className="App">
    {state.address !== null ? (
      <Button
        icon="cross"
        onClick={() => {
          state.clearSigner();
        }}
      >
        <code>{state.address}</code>
      </Button>
    ) : (
      <Button
        icon="log-in"
        onClick={async () => {
          const provider = await new ethers.providers.Web3Provider(
            window.ethereum
          );
          await provider.send("eth_requestAccounts");
          await state.setSigner(provider.getSigner());
        }}
        intent={Intent.PRIMARY}
      >
        Connect wallet
      </Button>
    )}
  </div>
));

export default App;
