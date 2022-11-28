import { useState, useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { canClaim, claim } from '../../lib/blockchainHandler'

function Claimer() {

  const [canClaimData, canClaimUpdate] = useState('No');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    canClaim(canClaimUpdate)
  }, [sending]);

  const handleClaim = async () => {
    setSending(true);
    await claim(setSending);
  }

  return  (<div>
              <LoadingButton style={{width : '200px'}} loading={sending} onClick={handleClaim} loadingIndicator="Claiming..." variant="outlined">
                Claim
              </LoadingButton>
          </div>)

}

export { Claimer };