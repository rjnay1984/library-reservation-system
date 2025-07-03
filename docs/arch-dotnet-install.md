# Installing .NET on Arch Linux

## Using pacman

The simplest way to install .NET on Arch Linux is through the official repositories:

```bash
sudo pacman -S dotnet-sdk
sudo pacman -S aspnet-runtime
```

This will install the latest version of the .NET SDK, which includes everything you need to build and run .NET applications.

## Verify Installation

After installation, verify that .NET was installed correctly:

```bash
dotnet --version
```

## Alternative Installation Methods

If you need a specific version of .NET, you can also install it through the AUR or Microsoft's packages:

1. Using AUR (example for .NET 6.0):
```bash
yay -S dotnet-sdk-6.0
```

2. Using Microsoft's packages:
   - First, follow Microsoft's instructions to set up their repository
   - Then install the specific version you need

## Common Issues

If you encounter permission issues, make sure your user is in the correct groups:

```bash
sudo usermod -aG users $(whoami)
```

For more information, visit the [Arch Linux .NET Wiki](https://wiki.archlinux.org/title/.NET).


## Using pacman

The simplest way to install .NET on Arch Linux is through the official repositories:

```bash
sudo pacman -S dotnet-sdk
```

This will install the latest version of the .NET SDK, which includes everything you need to build and run .NET applications.

## Verify Installation

After installation, verify that .NET was installed correctly:

```bash
dotnet --version
```

## Alternative Installation Methods

If you need a specific version of .NET, you can also install it through the AUR or Microsoft's packages:

1. Using AUR (example for .NET 6.0):
```bash
yay -S dotnet-sdk-6.0
```

2. Using Microsoft's packages:
   - First, follow Microsoft's instructions to set up their repository
   - Then install the specific version you need

## Common Issues

If you encounter permission issues, make sure your user is in the correct groups:

```bash
sudo usermod -aG users $(whoami)
```

For more information, visit the [Arch Linux .NET Wiki](https://wiki.archlinux.org/title/.NET).