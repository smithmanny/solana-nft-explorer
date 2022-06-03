import type { NextPage } from 'next'
import Image from 'next/image'
import React, { ChangeEvent, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as solana from '@solana/web3.js';

const Home: NextPage = () => {
  const [userNFTS, setUserNFTS] = useState<Array<string>>([])
  const [walletAddress, setWalletAddress] = useState<string>('')

  useEffect(() => {
    async function getNFTAddresses() {
      if (!walletAddress) {
        return
      }

      const connection = new solana.Connection(solana.clusterApiUrl('mainnet-beta'), 'confirmed');
      const publicKey = new solana.PublicKey(walletAddress)
      const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID })
      const nfts:Array<string> = []

      tokenAccounts.value.forEach(async (e) => {
        const accountInfo = AccountLayout.decode(e.account.data);

        // Filter for address for NFT's
        if (accountInfo.amount === BigInt(1)) {
          const nftAddress = String(new solana.PublicKey(accountInfo.mint))
          nfts.push(nftAddress)
        }
      })

      return setUserNFTS(nfts)
    }

    getNFTAddresses()
  }, [walletAddress])

  const updateWalletAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value)
  }

  const openNFTLink = (address: string) => {
    const url = `https://explorer.solana.com/address/${address}`
    return window.open(url)
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
      <TextField
        name="walletAddress"
        label="Enter a Solona wallet address"
        onChange={updateWalletAddress}
        value={walletAddress}
        sx={{ my: 8 }}
        required
      />

      <Grid container spacing={2}>
        {userNFTS.map(userNFT => (
          <Grid item xs={12} sm={6} md={4} key={userNFT}>
            <Card onClick={() => openNFTLink(userNFT)}>
              <CardActionArea>
                <CardMedia>
                  <Image
                    src='/nft-min.jpeg'
                    layout="responsive"
                    objectFit="cover"
                    alt="Link to NFT"
                    height="150"
                    width="150"
                  />
                </CardMedia>
                <CardContent>
                  <Typography>
                    {userNFT}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home
