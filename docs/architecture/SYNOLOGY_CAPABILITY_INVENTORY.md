# STATUS
**DISCOVERY**: COMPLETED (Read-Only)

# NAS IDENTITY
**DOCUMENTED / OBSERVED / TESTED**
- **DSM Version**: 7.4.1-90080 [OBSERVED]
- **Model**: DS223j [OBSERVED]
- **Architecture**: Linux TUANDZAIN-NAS 5.10.55+ #90080 SMP Wed Jul 22 00:08:48 CST 2026 aarch64 GNU/Linux synology_rtd1619b_ds223j [OBSERVED]

# SYSTEM
- **Kernel/Arch**: Linux TUANDZAIN-NAS 5.10.55+ #90080 SMP Wed Jul 22 00:08:48 CST 2026 aarch64 GNU/Linux synology_rtd1619b_ds223j [TESTED]
- **Enabled Services**: sshd, nginx (webapi) [TESTED]

# STORAGE
**Volumes & Filesystem** [TESTED]
```text
/dev/vg1/volume_1 btrfs     7.0T  4.5T  2.6T  64% /volume1
```

# FILE MANAGEMENT
**Shared Folders** [TESTED]
```text
@S2S
@SynoDrive
@SynoFinder-etc-volume
@SynoFinder-log
@SynologyApplicationService
@SynologyDriveShareSync
@USBCopy
@appconf
@appdata
@apphome
@appshare
@appstore
@apptemp
@autoupdate
@cloudsync
@database
@download
@eaDir
@resource-monitor
@synoconfd
@synologydrive
@tmp
@userpreference
NetBackup
TUAN_ATLAS
TUAN_FORGE
homes
photo
web
web_packages
```
**File APIs (SYNO.FileStation.*)** [OBSERVED]
- `SYNO.FileStation.BackgroundTask` (v1-3) | path: `entry.cgi`
- `SYNO.FileStation.CheckExist` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.CheckPermission` (v1-3) | path: `entry.cgi`
- `SYNO.FileStation.Compress` (v1-3) | path: `entry.cgi`
- `SYNO.FileStation.CopyMove` (v1-3) | path: `entry.cgi`
- `SYNO.FileStation.CreateFolder` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Delete` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.DirSize` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Download` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.External.GoogleDrive` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Extract` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Favorite` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.FormUpload` (v2-2) | path: `entry.cgi`
- `SYNO.FileStation.Info` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.List` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.MD5` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Mount` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Mount.List` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Notify` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.PhotoUpload` (v2-3) | path: `entry.cgi`
- `SYNO.FileStation.Property` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Property.ACLOwner` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Property.CompressSize` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Property.Mtime` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Rename` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Search` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Search.History` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Settings` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Sharing` (v1-3) | path: `entry.cgi`
- `SYNO.FileStation.Sharing.Download` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Snapshot` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Thumb` (v1-3) | path: `entry.cgi`
- `SYNO.FileStation.ThumbInfo` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Timeout` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.UIString` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.Upload` (v2-3) | path: `entry.cgi`
- `SYNO.FileStation.UserGrp` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.VFS.Connection` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.VFS.File` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.VFS.GDrive` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.VFS.Profile` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.VFS.Protocol` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.VFS.User` (v1-1) | path: `entry.cgi`
- `SYNO.FileStation.VirtualFolder` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Worm` (v1-2) | path: `entry.cgi`
- `SYNO.FileStation.Worm.Lock` (v1-2) | path: `entry.cgi`

# SEARCH / INDEXING
**Search APIs** [OBSERVED]
- `SYNO.Core.MediaIndexing` (v1-1) | path: `entry.cgi`
- `SYNO.Core.MediaIndexing.IndexFolder` (v1-1) | path: `entry.cgi`
- `SYNO.Core.MediaIndexing.MediaConverter` (v1-2) | path: `entry.cgi`
- `SYNO.Core.MediaIndexing.Scheduler` (v1-1) | path: `entry.cgi`
- `SYNO.Core.MediaIndexing.ThumbnailQuality` (v1-1) | path: `entry.cgi`
- `SYNO.Core.UISearch` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation.BTSearch` (v1-1) | path: `DownloadStation/btsearch.cgi`
- `SYNO.DownloadStation2.BTSearch` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.BTSearch` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.eMule.Search` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.AppIndexing.Search` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.Elastic.SearchHistory` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.FileIndexing.Folder` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.FileIndexing.Highlight` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.FileIndexing.Indicate` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.FileIndexing.Search` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.FileIndexing.Status` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.FileIndexing.Term` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Index` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Search.Filter` (v1-4) | path: `entry.cgi`
- `SYNO.Foto.Search.Search` (v1-7) | path: `entry.cgi`
- `SYNO.FotoTeam.Index` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.Search.Filter` (v1-4) | path: `entry.cgi`
- `SYNO.FotoTeam.Search.Search` (v1-7) | path: `entry.cgi`

# APPLICATIONS
**Installed Packages** [OBSERVED]
```text
DownloadStation-4.1.2-5012: Download Station is a web-based download application which allows you to download files from the Internet through BT, FTP, HTTP, NZB, and eMule, and subscribe to RSS feeds to keep you updated on the hottest or latest BT. It offers the auto unzip service to help you extract compressed files to your Synology NAS whenever files are downloaded. With Download Station, you can download files from multiple file hosting sites, and search for torrent files via system default search engines as well as self-added engines with the BT search function. To respect the creators' and distributors' intellectual property rights and avoid legal issues, make sure to have the right authorization before uploading or downloading copyrighted materials.
ActiveInsight-3.0.6-24124: Active Insight is a cloud service that provides better technical support experience with faster troubleshooting. When enabled on multiple of your Synology hosts, it allows you to manage them across locations with a performance monitoring and automated warning system.
WebStation-4.3.1-0530: With Web Station, you can easily host and publish your own website. Additionally, after installing the PHP package, you can freely create dynamic websites for your personal use or business.
Spreadsheet-3.7.2-22592: Synology Office is a collaboration-focused application for creating documents, spreadsheets, and slides in Synology Drive. It offers a range of built-in tools for editing and reviewing content. To protect sensitive data, you can encrypt files with a password to enhance privacy.
SynoOnlinePack_v2-1071: This package is for users to update drive database online
SecureSignIn-1.1.7-0455: Secure SignIn Service provides enhanced account security for your DSM. It allows passwordless logins and offers sign-in options in addition to basic 2-factor authentication methods.
StorageManager-1.1.0-2018: Storage Manager is a built-in application for managing storage on your Synology NAS. It offers a centralized interface to allocate storage capacity, monitor usage, check your drives' health, and use advanced features such as hot spare drives and SSD cache.
WordPress-6.8.6-1506: WordPress is an open source blog tool and publishing platform powered by PHP and MySQL. The package enables you to host a WordPress blog on your Synology NAS.
Node.js_v22-22.19.0-1006: Built on Chrome's JavaScript runtime, Node.js has become a widely popular platform for users to easily build fast, scalable network applications.
Apache2.4-2.4.63-0155: Apache HTTP Server is an open source HTTP server for modern operating systems, including UNIX and Windows. With the package installed, you can choose Apache as the back-end server in Web Station.
PHP8.2-8.2.28-0107: PHP is an open source scripting language which aims to help web developers write dynamically generated web pages efficiently. This language is suitable for web development in that it can be easily embedded into HTML.
VPNCenter-1.4.10-2984: VPN Server offers an easy VPN solution that turns your Synology product into a VPN server, providing a secure method to connect to a private LAN at a remote location. All PPTP, OpenVPN, and L2TP/IPSec services are supported.
SynoAnalytics-1.0.5-20017: 
Tailscale-1.102.2-700102002: Connect all your devices using WireGuard, without the hassle.
QuickConnect-1.0.10-0187: QuickConnect allows client applications to connect to your Synology NAS via the Internet without setting up port forwarding rules. It can also work with Synology-developed packages, such as File Station, Surveillance Station, Synology Drive, Synology Photos, and mobile applications.
PDFViewer-1.3.1-1232: PDF Viewer displays PDF files with ease and rapidity, and allows you to share PDF files simply with an encryptable link.
MariaDB10-10.11.11-1551: MariaDB is a community-developed fork of MySQL and is one of the most widely used open-source relational database management system (RDBMS). It is highly compatible with MySQL and allows users to effortlessly migrate databases from MySQL to MariaDB. With MariaDB, you can easily and efficiently read, update and manage your data.
Python2-2.7.18-1004: Python is an interpreted, interactive, and object-oriented programming language suitable for distributed application development, scripting, numeric computing and system testing. With Python, you can develop or integrate your systems more quickly and effectively.
LogCenter-1.3.2-2074: Log Center offers an easy solution for gathering and displaying log messages from network devices. It provides you with a centralized log management interface and the flexible search function to help you find the useful information efficiently.
ScsiTarget-1.0.12-0802: SAN Manager helps you to manage and monitor your iSCSI and Fibre Channel services easily. Both iSCSI and Fibre Channel are storage area network (SAN) services that provide access to consolidated and block-level data storage. Clients can access storage space over storage network as if the space were local disks.
SynologyPhotos-1.9.1-10928: Synology Photos provides a series of smart and flexible features, allowing both photography lovers and home users to manage photos with ease.
SynologyDrive-4.0.3-27892: Synology Drive Server is a comprehensive solution for file storage, management, sharing, and synchronization. It enables teams to access files securely across devices, collaborate more efficiently, and maintain full control over their data within a private cloud environment.
FileStation-1.4.4-2221: File Station is the centralized file management tool for your Synology storage system. Through File Station, you can manage and search files/folders, view files of various types, share private files with external users, and do much more.
OAuthService-1.3.0-0220: OAuth Service is an open standard protocol for account authorization and authentication. It allows resource owners to authorize third-party access to their server resources without sharing their credentials. The package adopts OAuth 2.0 standard.
SMBService-4.15.13-4251: SMB Service is an easy-to-use file service management tool, allowing you to manage general settings related to the SMB/CIFS file sharing service. Through SMB Service, Windows, macOS, and Linux users can access your Synology NAS from the network once you have enabled the SMB service option in Control Panel.
SupportService-2.0.5-21076: 
SynoFinder-1.9.0-0900: Synology Universal Search is a powerful search tool for your Synology NAS. In one search, you can find matched items from photos to notes. You can also index folders to provide precise and prompt search results by filename or file content. With Synology Universal Search, everything on your Synology NAS is just a few clicks away.
USBCopy-2.2.1-1306: USB Copy helps you copy files between your Synology NAS and external USB/SD storage devices. File copy can start right after an external storage device is plugged in to the Synology NAS, without any need to open the DSM web console. USB Copy comes with multiple copy and file organization strategies to ensure efficient storage usage and easy location of files.
Node.js_v20-20.19.5-1014: Built on Chrome's JavaScript runtime, Node.js has become a widely popular platform for users to easily build fast, scalable network applications.
UniversalViewer-1.4.0-0712: Universal Viewer allows you to view different file formats directly on the Synology Drive without having to open each application. Certain packages require Universal Viewer to function fully.
CloudSync-2.7.3-2721: With Cloud Sync, you can seamlessly sync and share files among your Synology NAS and multiple public clouds, such as Dropbox, Baidu Cloud and Google Drive.
SynologyApplicationService-1.9.0-20810: Synology Application Service provides a framework to enrich features and services of Synology packages, including push notifications and profile settings. With Synology Application Service, coherent configurations can be shared across different packages.
phpMyAdmin-5.2.2-1102: phpMyAdmin is a free software tool designed to manage the MariaDB databases. Manage the MariaDB databases stored on your Synology NAS by installing this package.
```
**Application APIs (Drive/Photos)** [OBSERVED]
*Drive:*
- `SYNO.Core.ExternalDevice.Printer.Driver` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Activation` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.AdvanceSharing` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.AdvanceSharing.Public` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.AppIntegration` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Config` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Connection` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.DBUsage` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.DSM` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Dashboard` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.FileRequest` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.FileRequest.Public` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Files` (v1-11) | path: `entry.cgi`
- `SYNO.SynologyDrive.HybridShare.Privilege` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Index` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Info` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.KeyManagement` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Labels` (v1-3) | path: `entry.cgi`
- `SYNO.SynologyDrive.Log` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Metrics` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Metrics.Token` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Migration` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Migration.UserHome` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Mobile.Notification` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Node` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Node.Delete` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Node.Download` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Node.Restore` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.NodeLocking` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.NodeLockingOption` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Notifications` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.Office` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Photos` (v1-3) | path: `entry.cgi`
- `SYNO.SynologyDrive.Privilege` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Profiles` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.Revisions` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.SCIM.Photo` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.SCIM.User` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Services.DocumentViewer` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Services.SynologyChat` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Services.VideoStation` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Settings` (v1-3) | path: `entry.cgi`
- `SYNO.SynologyDrive.Shard` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Share` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.Share.Priv` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Sharing` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.Sharing.Report` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Statistics` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.String` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Tasks` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.TeamFolders` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Trash` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.Users` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDrive.Webhooks` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDriveShareSync.Config` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDriveShareSync.Connection` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDriveShareSync.Session` (v1-1) | path: `entry.cgi`
- `SYNO.SynologyDriveShareSync.Session.Set` (v1-1) | path: `entry.cgi`
- `SYNO.VideoPlayer.SynologyDrive.Subtitle` (v1-1) | path: `entry.cgi`
*Photos:*
- `SYNO.Core.PhotoViewer` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.PhotoRequest` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Upload.PhotoRequestItem` (v1-3) | path: `entry.cgi`
- `SYNO.Personal.Profile.Photo` (v1-2) | path: `entry.cgi`

# API SURFACE
**System APIs**
- `SYNO.Core.ACL` (v1-2) | path: `entry.cgi`
- `SYNO.Core.ActionPriv` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ActionPriv.Role` (v1-1) | path: `entry.cgi`
- `SYNO.Core.AppNotify` (v1-1) | path: `entry.cgi`
- `SYNO.Core.AppPortal` (v1-2) | path: `entry.cgi`
- `SYNO.Core.AppPortal.AccessControl` (v1-1) | path: `entry.cgi`
- `SYNO.Core.AppPortal.Config` (v1-1) | path: `entry.cgi`
- `SYNO.Core.AppPortal.ReverseProxy` (v1-1) | path: `entry.cgi`
- `SYNO.Core.AppPriv` (v1-2) | path: `entry.cgi`
- `SYNO.Core.AppPriv.App` (v1-3) | path: `entry.cgi`
- `SYNO.Core.AppPriv.Rule` (v1-1) | path: `entry.cgi`
- `SYNO.Core.BandwidthControl` (v1-2) | path: `entry.cgi`
- `SYNO.Core.BandwidthControl.Protocol` (v1-1) | path: `entry.cgi`
- `SYNO.Core.BandwidthControl.Status` (v1-1) | path: `entry.cgi`
- `SYNO.Core.CMS` (v1-2) | path: `entry.cgi`
- `SYNO.Core.CMS.Cache` (v1-2) | path: `entry.cgi`
- `SYNO.Core.CMS.Identity` (v1-1) | path: `entry.cgi`
- `SYNO.Core.CMS.Info` (v1-1) | path: `entry.cgi`
- `SYNO.Core.CMS.Policy` (v1-1) | path: `entry.cgi`
- `SYNO.Core.CMS.ServerInfo` (v1-2) | path: `entry.cgi`
- `SYNO.Core.CMS.Token` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Certificate` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Certificate.CRT` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Certificate.CSR` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Certificate.LetsEncrypt` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Certificate.LetsEncrypt.Account` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Certificate.Service` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Certificate.Tencent` (v1-1) | path: `entry.cgi`
- `SYNO.Core.CurrentConnection` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DDNS.Ethernet` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DDNS.ExtIP` (v1-2) | path: `entry.cgi`
- `SYNO.Core.DDNS.Provider` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DDNS.Record` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DDNS.Synology` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DDNS.TWNIC` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DSMNotify` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DSMNotify.MailContent` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DSMNotify.Strings` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DataCollect` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DataCollect.Application` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Desktop.Defs` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Desktop.Initdata` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Desktop.JSUIString` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Desktop.PersonalUpdater` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Desktop.SessionData` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Desktop.Timeout` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Desktop.UIString` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Desktop.Upgrade` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.Azure.SSO` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.Domain` (v1-3) | path: `entry.cgi`
- `SYNO.Core.Directory.Domain.Conf` (v1-3) | path: `entry.cgi`
- `SYNO.Core.Directory.Domain.Trust` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.Entra.SSO` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.LDAP` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Directory.LDAP.BaseDN` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Directory.LDAP.Login.Notify` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.LDAP.Profile` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Directory.LDAP.Refresh` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.OIDC.SSO` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.CAS` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.IWA` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.Profile` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.SAML` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.SAML.Metadata` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.SAML.Status` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.Setting` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.Status` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.SSO.utils` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.WebSphere.SSO` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DirectoryServiceCheck.Common` (v1-2) | path: `entry.cgi`
- `SYNO.Core.DirectoryServiceCheck.Debug` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DirectoryServiceCheck.Domain` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DirectoryServiceCheck.DomainJoin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DirectoryServiceCheck.DomainService` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DirectoryServiceCheck.DomainValidation` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DirectoryServiceCheck.LDAP` (v1-1) | path: `entry.cgi`
- `SYNO.Core.DirectoryServiceCheck.Progress` (v1-2) | path: `entry.cgi`
- `SYNO.Core.DisableAdmin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.EW.Info` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Bluetooth` (v1-2) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Bluetooth.Device` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Bluetooth.Settings` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.DefaultPermission` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Printer` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Printer.BonjourSharing` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Printer.USB` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.UPS` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Factory.Config` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Factory.Manutild` (v1-1) | path: `entry.cgi`
- `SYNO.Core.File` (v1-2) | path: `entry.cgi`
- `SYNO.Core.File.Thumbnail` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileHandle` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.AFP` (v1-2) | path: `entry.cgi`
- `SYNO.Core.FileServ.FTP` (v1-3) | path: `entry.cgi`
- `SYNO.Core.FileServ.FTP.SFTP` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.FTP.Security` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.NFS` (v1-3) | path: `entry.cgi`
- `SYNO.Core.FileServ.NFS.AdvancedSetting` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.NFS.IDMap` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.NFS.Kerberos` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.NFS.SharePrivilege` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.ReflinkCopy` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.Rsync.Account` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.SMB` (v1-3) | path: `entry.cgi`
- `SYNO.Core.FileServ.SMB.Control` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.SMB.Kerberos` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.SMB.MSDFS` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.ServiceDiscovery` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.ServiceDiscovery.WSTransfer` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Findhost` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.BeepControl` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.EunitConnectionType` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.FanSpeed` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.Hibernation` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.LCM` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.Led.Brightness` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.MemoryLayout` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.NeedReboot` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.OOBManagement` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.PowerRecovery` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.RemoteFanStatus` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.SpectreMeltdown` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.VideoTranscoding` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.ZRAM` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Help` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ISCSI.FCTarget` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ISCSI.Host` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ISCSI.LUN` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ISCSI.Lunbkp` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ISCSI.Node` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ISCSI.Replication` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ISCSI.Target` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ISCSI.VMware` (v1-1) | path: `entry.cgi`
- `SYNO.Core.MyDSCenter` (v1-2) | path: `entry.cgi`
- `SYNO.Core.MyDSCenter.Account` (v1-1) | path: `entry.cgi`
- `SYNO.Core.MyDSCenter.Login` (v1-1) | path: `entry.cgi`
- `SYNO.Core.MyDSCenter.Logout` (v1-1) | path: `entry.cgi`
- `SYNO.Core.MyDSCenter.Purchase` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Advance.CustomizedData` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Advance.FilterSettings` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.Advance.FilterSettings.Profile` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Advance.FilterSettings.Template` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Advance.Variables` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Advance.WarningPercentage` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.CMS` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.CMS.Conf` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.Line` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Mail` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Mail.Conf` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.Mail.Profile.Conf` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Push` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Push.Conf` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Push.Mail` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.Push.Mobile` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.Push.Webhook.Provider` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.SMS` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.SMS.Conf` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.SMS.Provider` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Notification.Sysnotify` (v1-1) | path: `entry.cgi`
- `SYNO.Core.OTP` (v1-3) | path: `entry.cgi`
- `SYNO.Core.OTP.Admin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.OTP.EnforcePolicy` (v1-1) | path: `entry.cgi`
- `SYNO.Core.OTP.Ex` (v1-1) | path: `entry.cgi`
- `SYNO.Core.OTP.Mail` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PersonalNotification.Device` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PersonalNotification.Event` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PersonalNotification.Filter` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PersonalNotification.Mobile` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PersonalNotification.Settings` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PersonalSettings` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Polling.Data` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PortForwarding` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PortForwarding.Compatibility` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PortForwarding.Rules` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PortForwarding.Rules.Serv` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Promotion.Info` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Promotion.PreInstall` (v1-1) | path: `entry.cgi`
- `SYNO.Core.QuickConnect` (v1-3) | path: `entry.cgi`
- `SYNO.Core.QuickConnect.Hostname` (v1-1) | path: `entry.cgi`
- `SYNO.Core.QuickConnect.Permission` (v1-1) | path: `entry.cgi`
- `SYNO.Core.QuickConnect.RegisterSite` (v1-1) | path: `entry.cgi`
- `SYNO.Core.QuickConnect.SNI` (v1-1) | path: `entry.cgi`
- `SYNO.Core.QuickConnect.Upnp` (v1-1) | path: `entry.cgi`
- `SYNO.Core.QuickStart.Info` (v1-3) | path: `entry.cgi`
- `SYNO.Core.QuickStart.Install` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Quota` (v1-1) | path: `entry.cgi`
- `SYNO.Core.RecycleBin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Region.Language` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Region.NTP` (v1-3) | path: `entry.cgi`
- `SYNO.Core.Region.NTP.DateTimeFormat` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Region.NTP.Server` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ResetAdmin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SNMP` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.AutoBlock` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.AutoBlock.Rules` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.DSM` (v1-6) | path: `entry.cgi`
- `SYNO.Core.Security.DSM.Embed` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.DSM.Proxy` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.DoS` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Security.Firewall` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.Firewall.Adapter` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.Firewall.Conf` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.Firewall.Geoip` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.Firewall.Profile` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.Firewall.Profile.Apply` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.Firewall.Rules` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Security.Firewall.Rules.Serv` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SecurityScan.Conf` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SecurityScan.Operation` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SecurityScan.Status` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Service` (v1-3) | path: `entry.cgi`
- `SYNO.Core.Service.Conf` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Service.PortInfo` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.Crypto` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.Crypto.Key` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.CryptoFile` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.KeyManager.AutoKey` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.KeyManager.Key` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.KeyManager.MachineKey` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.KeyManager.Store` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Share.Migration` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.Permission` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.PermissionReport` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.ShellFile` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.Snapshot` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Sharing` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Sharing.Initdata` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Sharing.Login` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Sharing.Session` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SmartBlock` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SmartBlock.Device` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SmartBlock.Trusted` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SmartBlock.Untrusted` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SupportForm.Form` (v1-2) | path: `entry.cgi`
- `SYNO.Core.SupportForm.Log` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SupportForm.Service` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Synohdpack` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SyslogClient.FileTransfer` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SyslogClient.Log` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SyslogClient.PersonalActivity` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SyslogClient.Setting.Notify` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SyslogClient.Status` (v1-1) | path: `entry.cgi`
- `SYNO.Core.System` (v1-3) | path: `entry.cgi`
- `SYNO.Core.System.GpuInfo` (v1-1) | path: `entry.cgi`
- `SYNO.Core.System.Process` (v1-1) | path: `entry.cgi`
- `SYNO.Core.System.ResetButton` (v1-1) | path: `entry.cgi`
- `SYNO.Core.System.Status` (v1-1) | path: `entry.cgi`
- `SYNO.Core.System.SystemHealth` (v1-1) | path: `entry.cgi`
- `SYNO.Core.System.Utilization` (v1-1) | path: `entry.cgi`
- `SYNO.Core.TFTP` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Terminal` (v1-3) | path: `entry.cgi`
- `SYNO.Core.Theme.AppPortalLogin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Theme.Desktop` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Theme.FileSharingLogin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Theme.Image` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Theme.Login` (v1-1) | path: `entry.cgi`
- `SYNO.Core.TrustDevice` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Tuned` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Upgrade.AutoUpgrade` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.AutoUpgrade.Security` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Cluster.Patch` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Cluster.Server` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Cluster.Server.Download` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.JuniorModeData` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Patch` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Upgrade.PreCheck` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Upgrade.RemoteAction` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Server` (v1-4) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Server.Download` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Setting` (v1-4) | path: `entry.cgi`
- `SYNO.Core.Virtualization.Host.Capability` (v1-1) | path: `entry.cgi`
- `SYNO.Core.VolEncKeepKey` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Web.DSM` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Web.DSM.External` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Web.Security.HTTPCompression` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Web.Security.TLSProfile` (v1-1) | path: `entry.cgi`
- `SYNO.DSM.FindMe` (v2-2) | path: `entry.cgi`
- `SYNO.DSM.Info` (v2-2) | path: `entry.cgi`
- `SYNO.DSM.PortEnable` (v1-1) | path: `entry.cgi`
- `SYNO.DSM.PushNotification` (v2-2) | path: `entry.cgi`
- `SYNO.Office.Setting.System` (v1-1) | path: `entry.cgi`
**Storage APIs**
- `SYNO.Core.ExternalDevice.Storage.EUnit` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Storage.Setting` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Storage.USB` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Storage.eSATA` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Setting.Volume` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Storage.Disk` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Storage.Disk.FWUpgrade` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Storage.Pool` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Storage.Volume` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Storage.iSCSILUN` (v1-1) | path: `entry.cgi`
- `SYNO.LogCenter.Setting.Storage` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.BtrfsDedupe` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Cache.Protection` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Check` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.DetectedPool` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.DualEnclosure` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Enclosure` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.EncryptionKeyVault` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.EncryptionKeyVault.UnlockMode` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Flashcache` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.HddMan` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.KMIP` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Pool` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Scrubbing` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Smart` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Smart.Scheduler` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Spare` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Spare.Conf` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Storage` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.TaipeiEnclosure` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Volume` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Volume.Installer` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.Volume.OfflineOp` (v1-1) | path: `entry.cgi`
- `SYNO.Storage.CGI.VolumeReduction` (v1-1) | path: `entry.cgi`
**Task APIs**
- `SYNO.Core.BackgroundTask` (v1-1) | path: `entry.cgi`
- `SYNO.Core.CMS.Task` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Directory.Domain.Schedule` (v1-1) | path: `entry.cgi`
- `SYNO.Core.EventScheduler` (v1-1) | path: `entry.cgi`
- `SYNO.Core.EventScheduler.Root` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Hardware.PowerSchedule` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Share.Migration.Task` (v1-1) | path: `entry.cgi`
- `SYNO.Core.TaskScheduler` (v1-4) | path: `entry.cgi`
- `SYNO.Core.TaskScheduler.Root` (v1-4) | path: `entry.cgi`
- `SYNO.DownloadStation.Schedule` (v1-1) | path: `DownloadStation/schedule.cgi`
- `SYNO.DownloadStation.Task` (v1-3) | path: `DownloadStation/task.cgi`
- `SYNO.DownloadStation2.Settings.Scheduler` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task` (v1-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.BT` (v1-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.BT.File` (v1-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.BT.Peer` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.BT.Tracker` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.Complete` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.List` (v1-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.List.Polling` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.NZB.File` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.NZB.Log` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.Source` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.Statistic` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Task.eMule` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.BackgroundTask.File` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.BackgroundTask.Info` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.BackgroundTask.File` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Task` (v1-1) | path: `entry.cgi`
**Backup APIs**
- `SYNO.Backup.App` (v1-1) | path: `entry.cgi`
- `SYNO.Backup.App.Backup` (v1-1) | path: `entry.cgi`
- `SYNO.Backup.App.Restore` (v1-1) | path: `entry.cgi`
- `SYNO.Backup.Config.AutoBackup` (v1-2) | path: `entry.cgi`
- `SYNO.Backup.Config.Backup` (v1-2) | path: `entry.cgi`
- `SYNO.Backup.Config.Restore` (v1-2) | path: `entry.cgi`
- `SYNO.Backup.Service.NetworkBackup` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Backup.ED` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.NFS.ConfBackup` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.SMB.ConfBackup` (v1-1) | path: `entry.cgi`
- `SYNO.Lunbackup` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Backup` (v1-1) | path: `entry.cgi`
**Network APIs**
- `SYNO.Core.ExternalDevice.Printer.Network` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Printer.Network.Host` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Network.Bond` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Network.Ethernet` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Network.Ethernet.External` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.IPv6` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.IPv6.Router` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.IPv6.Router.Prefix` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.Interface` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.MACClone` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.OVS` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.PPPoE` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.PPPoE.Relay` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.Proxy` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.Router.Gateway.List` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.Router.Static.Route` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.TrafficControl.RouterRules` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.TrafficControl.Rules` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.UPnPServer` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.VPN` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.VPN.L2TP` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.VPN.OpenVPN` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.VPN.OpenVPN.CA` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.VPN.OpenVPNWithConf` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.VPN.OpenVPNWithConf.Certs` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.VPN.PPTP` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.WOL` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PortForwarding.RouterConf` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PortForwarding.RouterInfo` (v1-1) | path: `entry.cgi`
- `SYNO.Core.PortForwarding.RouterList` (v1-1) | path: `entry.cgi`
- `SYNO.DSM.Network` (v2-2) | path: `entry.cgi`
- `SYNO.VPNServer.Management.Account` (v1-1) | path: `entry.cgi`
- `SYNO.VPNServer.Management.Connection` (v1-1) | path: `entry.cgi`
- `SYNO.VPNServer.Management.Interface` (v1-1) | path: `entry.cgi`
- `SYNO.VPNServer.Management.Log` (v1-1) | path: `entry.cgi`
- `SYNO.VPNServer.Settings.Certificate` (v1-1) | path: `entry.cgi`
- `SYNO.VPNServer.Settings.Config` (v1-1) | path: `entry.cgi`
**Package APIs**
- `SYNO.ActiveInsight.Package` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Package` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Package.AutoUpgrade.Progress` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Control` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Eula` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Package.FakeIFrame` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Feed` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Info` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Installation` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Package.Installation.Download` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Legal.PreRelease` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Log` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.MyDS` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.MyDS.Purchase` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Progress` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Screenshot` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Screenshot.Server` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Server` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Package.Setting` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Setting.Update` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Thumb` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Thumb.Server` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Package.Uninstallation` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Package.Info` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Package.Module` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Package.Service` (v2-2) | path: `entry.cgi`
- `SYNO.Package` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Package` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Package.Ex` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Package.Request` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Package` (v1-1) | path: `entry.cgi`
**Other APIs**
- `SYNO.API.Encryption` (v1-1) | path: `entry.cgi`
- `SYNO.API.Info` (v1-1) | path: `entry.cgi`
- `SYNO.API.OTP` (v1-1) | path: `otp.cgi`
- `SYNO.ActiveInsight.CompleteCollection` (v1-2) | path: `entry.cgi`
- `SYNO.ActiveInsight.FileActivity` (v1-2) | path: `entry.cgi`
- `SYNO.ActiveInsight.License` (v1-2) | path: `entry.cgi`
- `SYNO.ActiveInsight.RelationManager` (v1-2) | path: `entry.cgi`
- `SYNO.ActiveInsight.Setting` (v1-2) | path: `entry.cgi`
- `SYNO.AudioPlayer` (v2-2) | path: `entry.cgi`
- `SYNO.AudioPlayer.Stream` (v2-2) | path: `entry.cgi`
- `SYNO.CloudSync` (v1-1) | path: `entry.cgi`
- `SYNO.DR.Node` (v1-1) | path: `entry.cgi`
- `SYNO.DR.Node.Credential` (v1-1) | path: `entry.cgi`
- `SYNO.DR.Node.Session` (v1-2) | path: `entry.cgi`
- `SYNO.Default.API` (v1-1) | path: `entry.cgi`
- `SYNO.DisasterRecovery.Log` (v1-1) | path: `entry.cgi`
- `SYNO.DisasterRecovery.Retention` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation.Info` (v1-2) | path: `DownloadStation/info.cgi`
- `SYNO.DownloadStation.RSS.Feed` (v1-1) | path: `DownloadStation/RSSfeed.cgi`
- `SYNO.DownloadStation.RSS.Site` (v1-1) | path: `DownloadStation/RSSsite.cgi`
- `SYNO.DownloadStation.Statistic` (v1-1) | path: `DownloadStation/statistic.cgi`
- `SYNO.DownloadStation2.Captcha` (v1-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.RSS.Feed` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.RSS.Filter` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.RSS.Item` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.AutoExtraction` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.BT` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.Emule` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.Emule.Location` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.FileHosting` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.FtpHttp` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.Global` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.Location` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.Nzb` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Settings.Rss` (v1-1) | path: `entry.cgi`
- `SYNO.DownloadStation2.Thumbnail` (v2-2) | path: `entry.cgi`
- `SYNO.DownloadStation2.eMule.Server` (v1-1) | path: `entry.cgi`
- `SYNO.Entry.Request` (v1-2) | path: `entry.cgi`
- `SYNO.Entry.Request.Polling` (v1-1) | path: `entry.cgi`
- `SYNO.Entry.SocketIo` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.Bookmark` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.Elastic.Spotlight` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.Elastic.Term` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.File` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.File.Cover` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.File.Thumbnail` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.Preference` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.Settings` (v1-1) | path: `entry.cgi`
- `SYNO.FolderSharing.Download` (v1-2) | path: `entry.cgi`
- `SYNO.FolderSharing.List` (v1-2) | path: `entry.cgi`
- `SYNO.FolderSharing.Thumb` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Browse.Album` (v1-5) | path: `entry.cgi`
- `SYNO.Foto.Browse.Category` (v1-4) | path: `entry.cgi`
- `SYNO.Foto.Browse.Concept` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Browse.ConditionAlbum` (v1-4) | path: `entry.cgi`
- `SYNO.Foto.Browse.Diff` (v1-7) | path: `entry.cgi`
- `SYNO.Foto.Browse.Folder` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Browse.GeneralTag` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Browse.Geocoding` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Browse.Item` (v1-7) | path: `entry.cgi`
- `SYNO.Foto.Browse.NormalAlbum` (v1-4) | path: `entry.cgi`
- `SYNO.Foto.Browse.Person` (v1-3) | path: `entry.cgi`
- `SYNO.Foto.Browse.RecentlyAdded` (v1-6) | path: `entry.cgi`
- `SYNO.Foto.Browse.Similar` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Browse.SimilarItem` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Browse.SimilarTimeline` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Browse.Timeline` (v1-6) | path: `entry.cgi`
- `SYNO.Foto.Browse.Unit` (v1-3) | path: `entry.cgi`
- `SYNO.Foto.Development.Admin` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Download` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Favorite` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Migration` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Notification` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.PublicSharing` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.RegeneratePreview` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Setting.Admin` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Setting.Guest` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Setting.MobileCompatibility` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Setting.TeamSpace` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Setting.Wizard` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Sharing.Misc` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Sharing.Passphrase` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Streaming` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Thumbnail` (v1-2) | path: `entry.cgi`
- `SYNO.Foto.Udc` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Upload.ConvertedFile` (v1-5) | path: `entry.cgi`
- `SYNO.Foto.Upload.Face` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Upload.Item` (v1-8) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Concept` (v1-2) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Diff` (v1-7) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Folder` (v1-2) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.GeneralTag` (v1-2) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Geocoding` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Item` (v1-7) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Person` (v1-3) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.RecentlyAdded` (v1-6) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Similar` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.SimilarItem` (v1-2) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.SimilarTimeline` (v1-2) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Timeline` (v1-6) | path: `entry.cgi`
- `SYNO.FotoTeam.Browse.Unit` (v1-3) | path: `entry.cgi`
- `SYNO.FotoTeam.Download` (v1-2) | path: `entry.cgi`
- `SYNO.FotoTeam.RegeneratePreview` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.Sharing.FolderBatchPermission` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.Sharing.FolderPermission` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.Sharing.Passphrase` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.Streaming` (v1-2) | path: `entry.cgi`
- `SYNO.FotoTeam.Thumbnail` (v1-2) | path: `entry.cgi`
- `SYNO.FotoTeam.Upload.ConvertedFile` (v1-5) | path: `entry.cgi`
- `SYNO.FotoTeam.Upload.Face` (v1-1) | path: `entry.cgi`
- `SYNO.FotoTeam.Upload.Item` (v1-8) | path: `entry.cgi`
- `SYNO.License.HA` (v1-1) | path: `entry.cgi`
- `SYNO.LogCenter.Client` (v1-2) | path: `entry.cgi`
- `SYNO.LogCenter.Client.CA` (v1-1) | path: `entry.cgi`
- `SYNO.LogCenter.History` (v1-1) | path: `entry.cgi`
- `SYNO.LogCenter.Log` (v1-2) | path: `entry.cgi`
- `SYNO.LogCenter.RecvRule` (v1-1) | path: `entry.cgi`
- `SYNO.MariaDB10.lib` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Dictionary` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Doc.Snapshot` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Export` (v1-1) | path: `entry.cgi`
- `SYNO.Office.File` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Import` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Info` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Info.Constants` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Locale` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Log` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Metrics` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Node` (v1-2) | path: `entry.cgi`
- `SYNO.Office.Node.Attachment` (v1-2) | path: `entry.cgi`
- `SYNO.Office.Node.Delete` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Node.Encrypt` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Node.Owner` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Node.Version` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Notification` (v1-1) | path: `entry.cgi`
- `SYNO.Office.OFile` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Permission` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Presentation.Snapshot` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Resource` (v1-2) | path: `entry.cgi`
- `SYNO.Office.Setting` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Setting.Font` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Setting.Person` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Setting.UI` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Shard` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Shard.Def` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Shard.Framework` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Shard.Info` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Shard.JSConfig` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Shard.Session` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Shard.Token` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Shard.Type` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Sheet.MruFc` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Sheet.Snapshot` (v1-2) | path: `entry.cgi`
- `SYNO.Office.Sheet.Snapshot.History` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Snapshot` (v1-4) | path: `entry.cgi`
- `SYNO.Office.Template` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Template.Permission` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Template.Thumb` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Theme` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Theme.Thumb` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Video` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Video.Thumb` (v1-1) | path: `entry.cgi`
- `SYNO.PDFViewer` (v1-1) | path: `entry.cgi`
- `SYNO.PDFViewer.Sharing` (v1-1) | path: `entry.cgi`
- `SYNO.PDFViewer.Sharing.Permission` (v1-1) | path: `entry.cgi`
- `SYNO.PersonMailAccount` (v1-1) | path: `entry.cgi`
- `SYNO.PersonMailAccount.Contacts` (v1-1) | path: `entry.cgi`
- `SYNO.PersonMailAccount.Mail` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.Application.Info` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.Application.Info.Local` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.MailAccount` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.MailAccount.Contacts` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.MailAccount.Mail` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.Notification.Conf` (v1-2) | path: `entry.cgi`
- `SYNO.Personal.Notification.Device` (v1-2) | path: `entry.cgi`
- `SYNO.Personal.Notification.Event` (v1-2) | path: `entry.cgi`
- `SYNO.Personal.Notification.Filter` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.Notification.GDPR` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.Notification.Identifier` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.Notification.Mobile` (v1-3) | path: `entry.cgi`
- `SYNO.Personal.Notification.Settings` (v1-2) | path: `entry.cgi`
- `SYNO.Personal.Notification.Token` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.Notification.VapidPublicKey` (v1-1) | path: `entry.cgi`
- `SYNO.Personal.Profile` (v1-3) | path: `entry.cgi`
- `SYNO.Remote.Credential` (v1-1) | path: `entry.cgi`
- `SYNO.Remote.Credential.Challenge` (v1-1) | path: `entry.cgi`
- `SYNO.Remote.Credential.Info` (v1-1) | path: `entry.cgi`
- `SYNO.Remote.Credential.Verifier` (v1-1) | path: `entry.cgi`
- `SYNO.ResourceMonitor.EventRule` (v1-1) | path: `entry.cgi`
- `SYNO.ResourceMonitor.Log` (v1-1) | path: `entry.cgi`
- `SYNO.ResourceMonitor.Setting` (v1-1) | path: `entry.cgi`
- `SYNO.S2S.Client` (v1-1) | path: `entry.cgi`
- `SYNO.S2S.Client.Job` (v1-1) | path: `entry.cgi`
- `SYNO.S2S.Server` (v1-1) | path: `entry.cgi`
- `SYNO.S2S.Server.Pair` (v1-1) | path: `entry.cgi`
- `SYNO.SAS.APIRunner` (v1-1) | path: `entry.cgi`
- `SYNO.SAS.APIRunner.Chatbot` (v1-1) | path: `entry.cgi`
- `SYNO.SAS.Encryption` (v1-1) | path: `entry.cgi`
- `SYNO.SAS.Guest` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.AMFA.Mail.Ex` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.AMFA.Policy` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.AMFA.SuggestConn` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Fido.Manage` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Fido.Manage.Ex` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Fido.Register` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Fido.Register.Ex` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Method` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Method.Admin` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Method.Ex` (v1-1) | path: `entry.cgi`
- `SYNO.SecurityAdvisor.Conf` (v1-1) | path: `entry.cgi`
- `SYNO.SecurityAdvisor.Conf.Checklist` (v1-1) | path: `entry.cgi`
- `SYNO.SecurityAdvisor.Conf.Checklist.Alert` (v1-1) | path: `entry.cgi`
- `SYNO.SecurityAdvisor.Conf.Location` (v1-1) | path: `entry.cgi`
- `SYNO.SecurityAdvisor.LoginActivity` (v1-1) | path: `entry.cgi`
- `SYNO.SecurityAdvisor.Report` (v1-1) | path: `entry.cgi`
- `SYNO.SecurityAdvisor.Report.HTML` (v1-1) | path: `entry.cgi`
- `SYNO.Snap.Usage.Share` (v1-1) | path: `entry.cgi`
- `SYNO.SupportService.Registration` (v1-2) | path: `entry.cgi`
- `SYNO.SupportService.RemoteActionFramework` (v1-2) | path: `entry.cgi`
- `SYNO.SupportService.Setting` (v1-2) | path: `entry.cgi`
- `SYNO.USBCopy` (v1-1) | path: `entry.cgi`
- `SYNO.Utils` (v1-1) | path: `entry.cgi`
- `SYNO.VideoPlayer.Subtitle` (v1-1) | path: `entry.cgi`
- `SYNO.WebRTC.Proxy` (v1-1) | path: `entry.cgi`
- `SYNO.WebRTC.Proxy.Sharing` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Default` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Docker` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.ErrorPage` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.HTTP.VHost` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.PHP` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.PHP.Profile` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Python` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Python.Profile` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.ScriptLanguage` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.ScriptLanguage.Utils` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Shortcut` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.Status` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.WebService.Portal` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.WebService.Portal.Log` (v1-1) | path: `entry.cgi`
- `SYNO.WebStation.WebService.Service` (v1-1) | path: `entry.cgi`

# AUTHORIZATION
**Auth APIs** [OBSERVED]
- `SYNO.API.Auth` (v1-7) | path: `entry.cgi`
- `SYNO.API.Auth.Key` (v7-7) | path: `entry.cgi`
- `SYNO.API.Auth.Key.Code` (v7-7) | path: `entry.cgi`
- `SYNO.API.Auth.RedirectURI` (v1-1) | path: `entry.cgi`
- `SYNO.API.Auth.Type` (v1-1) | path: `entry.cgi`
- `SYNO.API.Auth.UIConfig` (v1-1) | path: `entry.cgi`
- `SYNO.Auth.ForgotPwd` (v1-1) | path: `entry.cgi`
- `SYNO.Auth.RescueEmail` (v1-1) | path: `entry.cgi`
- `SYNO.Core.ExternalDevice.Printer.OAuth` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.Authentication` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Network.Authentication.Cert` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Mail.Auth` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Mail.Oauth` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Notification.Push.AuthToken` (v1-1) | path: `entry.cgi`
- `SYNO.Core.OAuth.Scope` (v1-1) | path: `entry.cgi`
- `SYNO.Core.OAuth.Server` (v1-1) | path: `entry.cgi`
- `SYNO.OAUTH.Client` (v1-1) | path: `entry.cgi`
- `SYNO.OAUTH.Common` (v1-1) | path: `entry.cgi`
- `SYNO.OAUTH.Log` (v1-1) | path: `entry.cgi`
- `SYNO.OAUTH.Scope` (v1-1) | path: `entry.cgi`
- `SYNO.OAUTH.Token` (v1-1) | path: `entry.cgi`
- `SYNO.PersonMailAccount.Mail.Oauth` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Authenticator` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Authenticator.Ex` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Authenticator.Info` (v1-2) | path: `entry.cgi`
- `SYNO.SecureSignIn.Authenticator.Registration` (v1-2) | path: `entry.cgi`
- `SYNO.SecureSignIn.Authenticator.Registration.Ex` (v1-2) | path: `entry.cgi`
- `SYNO.SecureSignIn.Authenticator.Request` (v1-1) | path: `entry.cgi`
- `SYNO.SecureSignIn.Authenticator.Verdict` (v1-2) | path: `entry.cgi`
- `SYNO.SynologyDrive.Authentication` (v1-3) | path: `entry.cgi`
**User/Group APIs**
- `SYNO.Core.Directory.LDAP.User` (v1-1) | path: `entry.cgi`
- `SYNO.Core.FileServ.FTP.ChrootUser` (v2-2) | path: `entry.cgi`
- `SYNO.Core.Group` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Group.ExtraAdmin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Group.Member` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Group.ValidLocalAdmin` (v1-1) | path: `entry.cgi`
- `SYNO.Core.GroupSettings` (v1-1) | path: `entry.cgi`
- `SYNO.Core.NormalUser` (v1-2) | path: `entry.cgi`
- `SYNO.Core.NormalUser.LoginNotify` (v1-1) | path: `entry.cgi`
- `SYNO.Core.RecycleBin.User` (v1-1) | path: `entry.cgi`
- `SYNO.Core.SmartBlock.User` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Group` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Group.Download` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.Group.Setting` (v1-1) | path: `entry.cgi`
- `SYNO.Core.Upgrade.GroupInstall` (v1-2) | path: `entry.cgi`
- `SYNO.Core.Upgrade.GroupInstall.Network` (v1-1) | path: `entry.cgi`
- `SYNO.Core.User` (v1-1) | path: `entry.cgi`
- `SYNO.Core.User.Group` (v1-1) | path: `entry.cgi`
- `SYNO.Core.User.Home` (v1-1) | path: `entry.cgi`
- `SYNO.Core.User.PasswordConfirm` (v1-2) | path: `entry.cgi`
- `SYNO.Core.User.PasswordExpiry` (v1-1) | path: `entry.cgi`
- `SYNO.Core.User.PasswordMeter` (v1-1) | path: `entry.cgi`
- `SYNO.Core.User.PasswordPolicy` (v1-1) | path: `entry.cgi`
- `SYNO.Core.User.UsernamePolicy` (v1-1) | path: `entry.cgi`
- `SYNO.Core.UserSettings` (v1-1) | path: `entry.cgi`
- `SYNO.Finder.UserGrp` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.Setting.User` (v1-1) | path: `entry.cgi`
- `SYNO.Foto.UserInfo` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Group` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Permission.User` (v1-1) | path: `entry.cgi`
- `SYNO.Office.Template.Sharing.Group` (v1-1) | path: `entry.cgi`
- `SYNO.Office.UserStatistics.Event` (v1-1) | path: `entry.cgi`
- `SYNO.SAS.Group` (v1-1) | path: `entry.cgi`
- `SYNO.SAS.Group.Members` (v1-1) | path: `entry.cgi`
- `SYNO.SecurityAdvisor.LoginActivity.User` (v1-1) | path: `entry.cgi`

# CLI / AUTOMATION
- Native CLI Tools: `/usr/syno/bin/*` (`synopkg`, `synoacltool`, `synoshare`, etc.) [OBSERVED]
- API Automation: via `webapi/entry.cgi` and `webapi/query.cgi` [TESTED]

# UNKNOWN
- Exact application-level ACLs for OAuth and Drive (requires authenticated context to test). [UNKNOWN]

# NOT TESTED
- 2FA mechanisms, Token creation, Login mutation, User/Group creation. [NOT TESTED]

# SECURITY BOUNDARIES
- **Network**: API exposed on port 5000/5001. SSH exposed on port 22.
- **Authentication**: `SYNO.API.Auth` is the mandatory gatekeeper for native File Station/Core API access. OAuth Service exists but does not govern `SYNO.FileStation.*`.
- **Authorization**: Determined by Synology local DSM users/groups (e.g., `tuandzain` is in `administrators` group, mapped to standard Linux ACLs and Synology Extended ACLs).

# NEXT DISCOVERY
- (Không có đề xuất. Nhiệm vụ kết thúc theo chỉ định).
