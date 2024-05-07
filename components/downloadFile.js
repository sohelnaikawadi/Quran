// import * as FileSystem from 'expo-file-system';

// const downloadFile = async (url, fileName) => {

//     console.log("entered download file");

//     const localFilePath = `${FileSystem.documentDirectory}${fileName}`;
//     try{
//     if(FileSystem.getInfoAsync(localFilePath)){
//         return true;
//     }
//     else{
//         console.log("entered else condition");
//         const downloadResumable = FileSystem.createDownloadResumable(
//             url,
//             localFilePath
//           );
//         const {uri} = await downloadResumable.downloadAsync();
//         console.log("uri is 1: ", uri);
//         return true;
//     }
//     }
//     catch(error){
//         log.error("Error occurred while downloading data");
//         return false;
//     }
// }

// export default downloadFile;
