# Avoiding Common Attacks

I have avoided "Re-entrancy Attacks" because I only use the ERC721 implementation for openzeppelin in order to transfer the cars between accounts. 

I use vetted safe math libraries for arithmetic operations, used also in the openzeppelin contracts, this will prevent Integer Overflow and Underflow.
