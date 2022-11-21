import { useMetaMask } from "metamask-react";

function TodayNftCounter() {

  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const {claimed, total} = {claimed: 23, total: 56}
  return (<div>
     <p>Today tokens</p>
     <p>{claimed}</p>
     <p>{total}</p>
    </div>)

}

export { TodayNftCounter };