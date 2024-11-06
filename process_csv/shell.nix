{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    python3
    python3Packages.pandas
	openssl.dev 
    python3Packages.numpy
  ];

  #shellHook = ''
  #'';
}

