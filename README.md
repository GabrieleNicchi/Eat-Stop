!!Important 
The API on which the application is based were created by the University of Milan for the purpose of creating an exam project. 
It is likely that these APIs have been removed and network calls, as a result, do not return any data


<h1>Introduction:</h1>

You have been hired by the Italian startup "eat and that's it" that sells meals at home. There
startup stands out from the competition for its speed of purchase and delivery. In fact, instead
rather than composing menus by choosing various dishes, the user can directly purchase a menu which
it is also delivered to the point from which it was purchased in a very short time by a
drone.

<h2>Home-Page:</h2>

<p>![Home_React](https://github.com/user-attachments/assets/4ac97848-cbae-4526-900f-b817e1faabd4)</p>

On the Home Page the user can view his profile, the list of meals near him and the last order placed

<h2>Profile:</h2>

<p>![ProfileNot_React](https://github.com/user-attachments/assets/c34a083a-72f3-4d59-ad73-eaa68f341327)</p>

If the user has not yet entered his data, a form will be shown to do so

<p>![Profile_React](https://github.com/user-attachments/assets/780ff0ef-fd8c-46c8-a4fa-e6e6a597bdad)</p>

Once registered, their information will be shown, a user cannot place an order until they are registered

<p>![NotRegistered_React](https://github.com/user-attachments/assets/50f1b9b5-2dd9-4158-aeea-f68eb485c0df)</p>


<h2>MenuList:</h2>

<p>![MenuList_React](https://github.com/user-attachments/assets/f861b770-2aea-40e0-87b6-3d5835bcdf52)</p>
<p>![Position_React](https://github.com/user-attachments/assets/30b2764f-d5e0-4092-9dca-7e0df2200f29)</p>

Once the permissions to access the location are accepted, the user can view 20 menus near him

MenuDetail:
![MenuDetail_React](https://github.com/user-attachments/assets/dade6cc8-875a-4e53-99e8-c67dc83dc111)
Once interacted with one of the menus, the user can view the meal in detail

Order:
![Order_React](https://github.com/user-attachments/assets/9f7628bb-d0df-487d-8fd6-c8a201c5c4cb)
As soon as the order is placed, three markers will be shown:
- Red: The location of the drone delivering the meal
- Blue: The location of where the order originated
- Yellow: The user's location
Every 5 seconds the screen updates showing the movement of the drone towards the arrival point (blue)

![CompleteOrder_React](https://github.com/user-attachments/assets/e27a8c71-a3eb-46da-a847-995de3c7c107)
Once the drone reaches its arrival, the information relating to the order is updated

Loading Screen:
![Loading](https://github.com/user-attachments/assets/cbadff59-fcd0-4366-8f84-bb16244c3766)


