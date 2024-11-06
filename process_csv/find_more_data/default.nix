{ pkgs ? import <nixpkgs> {} }:
with pkgs;
mkShell {
    nativeBuildInputs = [ rustc cargo openssl.dev pkg-config ];
}
