{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs =
    [ pkgs.python3 pkgs.python3Packages.pandas pkgs.python3Packages.tqdm ];

  shellHook = ''
    echo "Python environment with pandas and tqdm is ready."
  '';
}

