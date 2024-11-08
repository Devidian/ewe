﻿namespace WeaponThread
{
    partial class Weapons
    {
        internal Weapons()
        {
            // file convention: Name.cs - See Example.cs file for weapon property details.
            //
            // Enable your config files using the follow syntax, don't include the ".cs" extension:
            // ConfigFiles(Your1stConfigFile, Your2ndConfigFile, Your3rdConfigFile);
            ConfigFiles(CruiseMissileTurret,
                        TorpedoTurret,
                        LargeCruiseMissileLauncher,
                        SmallCruiseMissileLauncher,
                        LargeTorpedoLauncher,
                        SmallTorpedoLauncher,
                        LaserTurret,
                        PulseTurret);
        }
    }
}
