# The UserInfo Collection

In this collection, each **document** maps to a registered user. Each **document** has a unique, firebase-generated id, which is identical to the corresponding user's **uid** which stored in the firebase authentication service.

For each **UserInfo document**, it has below **attributes** (no subcollections):

* `chats`: **Map** | A map that stores key-values representing below two info of all the chats that the user has envolved.
    * `key`: The unique document ID of the chat document (stored in "Chats" collection).
    * `value`: The unique document ID of the last incoming chat message of this chat that has been read by the user.

* `description`: **String** | A string that demonstrating the user's biography.

* `dob`: **String** | The user's data of birth in **YYYY-MM-DD** format.

* `eduExps`: **Array** | 

* `email`: **String** | The user's email address.

* `favourite`: **Array** | 

* `files`: **Array** | 

* `firstName`: **String**

* `history`: **Array** | 

* `honors`: **Array** | 

* `lastName`: **String**

* `middleName`: **String**

* `mobile`: **String** | The user's mobile number.

* `projExps`: **Array** | 

* `skills`: **Array** | An array of the user's skills, each skill is represented in string format.

* `talked`: **Array** | An array contains of **UserInfo** document id (uid) of all the other users who have had a chat with the current user. Used for avoiding creating duplicate chats between two users, the user can only start a new chat with users whose **UserInfo** document id (uid) is not included in this array.

* `title`: **String** | The title, Mr., Mrs., ... etc.

* `wechat`: **String** | The user's wechat ID

* `workExps`: **Array** | 
