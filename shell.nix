let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    buildInputs = with pkgs; [
      pkgs.nodejs-18_x
      pkgs.nodePackages.npm
    ];
  }
