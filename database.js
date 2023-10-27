class CRUD {
  constructor() {}
  daTA;
  create(arr, Database) {
    //write

    if (arguments.length > 2) {
      const set = arguments[2].set;
      const ref = arguments[2].ref;

      const db = Database;
      set(ref(db, arr[0]), arr[arr.length - 1]);
    } else {
      Database.ref(arr[0]).set(arr[arr.length - 1]);
    }
  }
  async read(arr, Database) {
    if (arguments.length > 2) {
      const child = arguments[2].child;
      const ref = arguments[2].ref;
      const get = arguments[2].get;

      const dbRef = await ref(Database);

      return get(child(dbRef, arr[0]));
    } else {
      var r;
      let promise = Database.ref(arr[0])
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      r = await promise;
      return r;
    }
  }

  update(arr, Database) {
    if (arguments.length > 2) {
      const ref = arguments[2].ref;
      const child = arguments[2].child;
      const push = arguments[2].push;
      const update = arguments[2].update;
      //update v9
      update(ref(Database), arr[arr.length - 1]);
    } else {
      //update v8
      Database.ref().update(arr[arr.length - 1]);
    }

    return 0;
  }
  delete(arr, Database) {
    return new Promise((resolve, reject) => {
      try {
        if (arguments.length > 2) {
          const ref = arguments[2].ref;
          const remove = arguments[2].remove;
          //delete v9

          remove(ref(Database, arr[arr.length - 1]));
          resolve({ message: " Deletion  completed" });
        } else {
          //delete v8
          Database.ref(arr[0]).remove();
        }
      } catch (error) {
        reject({ message: "Error Deletion not completed" });
      }
    });

    return; //;
  }
}
class FirebaseDB {
  constructor(initInfo) {
    this._config = initInfo;
  }
  _DB;
  _versionObj;
  _break_error = false; // no erro found in rules array
  #msg(sms) {
    this._break_error = true;
    console.error(sms);
    return 0;
  }
  async _calculate(str, Arr, DB) {
    var crud = new CRUD();

    var x = await crud[str].call(CRUD, Arr, DB);
    //console.log(x);
    return x;
    // op.action(Arr);
  }
  init(
    {
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    } = {},
    FireBaseInitializeApp,
    FireBaseDatabase,
    versionObj = undefined
  ) {
    for (const key in arguments[0]) {
      arguments[0][key] == "" ? this.#msg("RULES ERROR!") : arguments[0][key];
    }
    if (this._break_error == true) {
      console.error(" Rule  error found");
      return;
    }
    const app = FireBaseInitializeApp(arguments[0]); //firebase.initializeApp(firebaseConfig)
    this._DB = FireBaseDatabase(); //firebase.database()
    this._versionObj = versionObj;
  }
  async operation(type, Arr) {
    var crud = new CRUD();
    var x;
    if (this._versionObj != undefined) {
      x = await crud[type].call(CRUD, Arr, this._DB, this._versionObj);
    } else {
      x = await crud[type].call(CRUD, Arr, this._DB);
    }

    return x;
  }
  listenOn(ref, obj, func) {
    if (this._versionObj != undefined) {
      const db = this._DB;
      const onValue = this._versionObj.onValue;
      const Ref = this._versionObj.ref;
      const starCountRef = Ref(db, ref);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        // updateStarCount(postElement, data);
      });
    } else {
      let promise = this._DB.ref(ref).on("value", (snapshot) => {
        const data = snapshot.val();
        obj.data = data;
        func(data);
        console.log(data, "data");
        return {
          snapshot: data,
        };
      });
    }
  }
}
let FireBaseDB = new FirebaseDB();
export default FireBaseDB;

//FireBaseDB.listenOn("agent",objct);
//FireBaseDB.operation("create",["agent/userID4",{nom:"raphael",postnom:"isango",Age:"25ans",matricule:230904320}]);
//FireBaseDB.operation("read",["users"]).then(res=>{
//  let alignment =[];
//   console.log(res);
//  tableManager.spreadData(res,"<td><button class='btn btn-outline-danger'>Open model</button></td>")
//});

//Firebase_DB.operation("update",[{"users/userID":{nom:"ruku",postnom:"isango",Age:"25ans",matricule:230904320}}]);
//Firebase_DB.operation("delete",["users/userID"]);

/*
   FireBaseDB.init({
    apiKey: "AIzaSyDVCWConwcMM-mfgKw9GafBp1lPdMdVVfc",
    authDomain: "firstry-firebase.firebaseapp.com",
    databaseURL: "https://firstry-firebase.firebaseio.com",
    projectId: "firstry-firebase",
    storageBucket: "firstry-firebase.appspot.com",
    messagingSenderId: "456817158758",
    appId: "1:456817158758:web:b98b373987b2965ce9dba7",
  },firebase,versionObj);

 */
