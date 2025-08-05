// Função que configura a serialização de BigInt como String
export function configureBigIntSerialization() {
  ;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
  }
}
