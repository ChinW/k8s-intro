refs:

1. consensus

https://hackernoon.com/types-of-consensus-protocols-used-in-blockchains-6edd20951899
https://hackernoon.com/different-blockchain-consensus-mechanisms-d19ea6c3bcd6

https://blockgeeks.com/guides/blockchain-consensus/#We_will_answer_these_questions_in_this_guide_Basic_Primer_Blockchain_Consensus_Protocol


BFT:
https://blockchain.works-hub.com/learn/understanding-blockchain-fundamentals-part-1-byzantine-fault-tolerance-78f64

https://www.coingecko.com/buzz/coingecko-consensus-algorithms-guide-part-2

## 2.1 Proof Of Work (POW)

Proof Of Work (POW) is the first blockchain consensus mechanism and was first used by Bitcoin.

The Proof Of Work process is known as mining and the nodes are known as miners. Miners solve complex mathematical puzzles which require a lot computational power. The first one to solve the puzzle gets to create a block and receives a reward for creating a block. 

Proof Of Work (POW) is the first blockchain consensus mechanism and was first used by Bitcoin.

The Proof Of Work process is known as mining and the nodes are known as miners. Miners solve complex mathematical puzzles which require a lot computational power. The first one to solve the puzzle gets to create a block and receives a reward for creating a block. 

PoW is conducted through miners (the people keeping the blockchain running by providing a huge amount of computing resources) competing to solve a cryptographic problem — also known as a hash puzzle. These miners help to verify every Bitcoin transaction, where it involves producing a hash-based (SHA256) PoW that is based off previous transaction blocks (read up on the Merkle Tree for more information) and forms a new branch with a new transaction block. This means that the work is moderately difficult for the miners to perform but easy for the network to verify. The first miner who manages to produce the PoW will be then awarded some Bitcoins. Over time, the amount of Bitcoin awarded decreases over time.


----
PoS allows a forger (instead of a miner) to stake any amount of cryptocurrency she has, to be probabilistically assigned a chance to be the one validating the block — the probability based on the amount of cryptocurrency staked.

The idea of putting coins to be ‘staked’ prevents bad actors from making fraudulent validations — upon false validation of transactions, the amount staked will be forfeited. Hence, this incentivises forgers to validate legitimately.

In the recent year, PoS has gained attention, with Ethereum switching towards a PoS from a PoW consensus system.


---
Solidity is an object-oriented, high-level language for implementing smart contracts. Smart contracts are programs which govern the behaviour of accounts within the Ethereum state.

Solidity was influenced by C++, Python and JavaScript and is designed to target the Ethereum Virtual Machine (EVM).

Solidity is statically typed, supports inheritance, libraries and complex user-defined types among other features.

With Solidity you can create contracts for uses such as voting, crowdfunding, blind auctions, and multi-signature wallets.