import React, {useState,useEffect}  from 'react';
import axios from 'axios';
import {getUser, removeUser} from '../../utils/common';
import '../../css/it19184722.css';


export default function CustomerUserProfile(props) {
    const [fname, setfirstName] = useState("");
    const [lname, setlastName] = useState("");
    const [email, setemail] = useState("");
    const [address, setaddress] = useState("");
    const [pNo, setphone] = useState("");
    const id = getUser();
    const [errors, seterrors] = useState([]);
    const [emailerror, setemailerror] = useState("");   
    const[loginMsg] = useState(localStorage.getItem("loginMsg"));//this sets logout msg if any
    const[success,setsuccess] = useState("")

    window.onload = function() {
        localStorage.removeItem("loginMsg")
    }//this resets the state on refreshing

  
    useEffect(() => {
        async function fetchData(){
            const customer = (await axios.get(`http://localhost:8070/customer/profile/${id}`,{withCredentials: true})).data;
            setfirstName(customer.fname);
            setlastName(customer.lname); 
            setemail(customer.email); 
            setaddress(customer.address);  
            setphone("0"+customer.pNo);    
        }
        fetchData();
    },[id])
  
    const personalInfoForm = () => {
        const inputFields = document.querySelectorAll("input[type='text']");
        for(let field = 0 ; field < inputFields.length ; field++){
            inputFields[field].removeAttribute('disabled');
        }
        document.getElementById('updateButton').removeAttribute('hidden');
        document.getElementById('cancelButton').removeAttribute('hidden');
        document.getElementById('resetButton').setAttribute('hidden', 'true');
        document.getElementById('editButton').setAttribute('hidden','true');
        
    }

    const editData = async(e) => {
        e.preventDefault();
        setemailerror('');
        seterrors([]);
        const response = await axios.post(`http://localhost:8070/customer/profile/update/${id}`,{fname,lname,address,pNo},{withCredentials: true});
        if (response.data.success) {
            const inputFields = document.querySelectorAll("input[type='text']");
            for(let field = 0 ; field < inputFields.length ; field++){
                inputFields[field].setAttribute('disabled','true');
            }
            document.getElementById('updateButton').setAttribute('hidden','true');
            document.getElementById('cancelButton').setAttribute('hidden','true');
            document.getElementById('resetButton').removeAttribute('hidden');
            document.getElementById('editButton').removeAttribute('hidden');
            setsuccess('You have successfully updated your profile!');
            props.history.push("/customer/profile");
        }
        if (response.data.errors) {
            seterrors(response.data.errors);
        }
        if(response.data.emailerror){
            setemailerror(response.data.emailerror);
        } 
    }
    const cancelUpdate = () => {
            window.location = '/customer/profile'
    }

    const resetButton = () => {
        props.history.push("/customer/profile/password-reset");
    }
    const logoutHandler = () => {
        if(window.confirm("Do you want to logout?")){
            removeUser();
            localStorage.setItem('logoutMsg', 'You have successfully logged out!');
            window.location = '/customer/login'
        }
    }
    return (
        <div id="it19184722-Profile">
            <form className="form-group it19184722-myForm">
                <h2>User Profile</h2>
                <button className="btn-danger btn it19184722-red-btn" id="it19184722-logout-btn" onClick={logoutHandler}>Log out</button>
                {errors ? errors.map((error) => {
                    return (
                        <div class="alert alert-danger" role="alert">
                            {error.msg}
                      </div>
                    )
                }):null}
                {emailerror ? 
                <div class="alert alert-danger" role="alert">
                    {emailerror}
                </div>: null}
                {loginMsg ? 
                <div class="alert alert-success" role="alert">
                {loginMsg}
                </div> : null}
                {success ? 
                <div class="alert alert-success" role="alert">
                    {success}
                </div>: null}
                <label>First name</label>
                <input className="form-control" type="text" onChange={(e) => setfirstName(e.target.value)} value={fname} disabled/><br/>  

                <label>Last name</label>
                <input className="form-control" type="text" onChange={(e) => setlastName(e.target.value)} value={lname} disabled/><br/>     

                <label>Email</label>
                <input className="form-control" type="email" value={email} disabled/><br/>

                <label>Address</label>
                <input className="form-control" type="text" onChange={(e) => setaddress(e.target.value)} value={address} disabled/><br/> 

                <label>Phone No</label>
                <input className="form-control" type="text" onChange={(e) => setphone(e.target.value)} value={pNo} disabled/><br/> 

                <div className="it19184722-btn-section">
                    <input id="editButton" type="button" value="Edit Details" onClick={personalInfoForm} className="it19184722-green-btn btn" style={{marginRight:'5px'}}/>
                    <input id="resetButton" type="button" value="Reset Password" onClick={resetButton} className="it19184722-trans-green-btn btn"/>
                    <input id="updateButton" type="button" value="Update" onClick={editData} className="it19184722-green-btn btn" style={{marginRight:'5px'}} hidden/>
                    <input id="cancelButton" type="button" value="Cancel" onClick={cancelUpdate} className="btn-danger btn it19184722-red-btn" hidden/>
                </div>
            </form>
        </div>
    )
}
