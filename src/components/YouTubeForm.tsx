import React, { useEffect } from "react";
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';//useFieldArray is used to add mutiple inout fields and it works with object values
import { DevTool } from "@hookform/devtools"
import { log } from "console";

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];//added for useFieldarrays
  age: number;
  dob: Date
}


export const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "Batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: ""
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
    //mode: "onSubmit" // default is onSubmit tht means on submit the validation occurs & onTounched .onBlur,onChangeis also and option use 'all" to use blur and onchange modes
    //this is for showing default value , and if we want to show prevoiulsy saved data we use async functions
    // defaultValues: async () => {
    //   const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    //   const data = await response.json();
    //   return {
    //     username: "Batman",
    //     email: data.email,
    //     channel: ""
    //   }
    // }
  });
  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState;
  // const { name, ref, onChange, onBlur } = register(namefield);
  //register:-to register a field with react-hook-form we use register
  //control:- it is for visulization in development
  //isdirty is for entire form even if we update single field the boolean value changes it hepls for cases where user enters data and then only show the submit button
  //touchedfields and dirtyfields cover the object fields holding individual fields with touch and dirty key
  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control
  });

  const watchField = watch("username") // or give empty watch() to watch entire form fields this is helpful to preview the form field values and also we can use useEffect to console the values with watch as dependency array




  const handleGetValues = () => {
    console.log(getValues());//to check field values in log same as watch we can pass empty || fieldvalue||array of field values
  }

  const handleSetValues = () => {
    setValue("age", 25, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });//setValues takes fieldname and value for that fieldname as arg we also need to change it as human changed so add validate,dirty,touch

  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful])

  console.log("errors", errors);

  const onSubmit = (data: FormValues) => {
    console.log("form", data)
  }

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("form Errors", errors);
    //this functins is called when we submit the frm with errors with failed validation
  }

  return (
    <div>
      <h2>Hi {watchField}</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" {...register("username", { required: "username is required" })} />
        <p className="error">{errors.username?.message}</p>

        <label htmlFor="email">E-mail</label>
        <input id="email" {...register("email", {
          pattern: {
            value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: "Invalid email format",
          },//cutom validation that return ture and error message if it fails, we can alos write validate for an bject so in that case i am commenting the single validation again the email field with
          // validate: (fieldValue) => {
          //   return fieldValue !== "admin@example.com" || "Enter a diff email address"
          // }
          validate: {
            notAdmin: (fieldValue) => {
              return fieldValue !== "admin@example.com" || "Enter a diff email address"
            },
            notBlackListed: (fieldValue) => {
              return !fieldValue.endsWith("baddomain.com") || "This domain is not supported"
            },
            // emailAvaliable: async (fieldValue) => {
            //   const response = await fetch(`https://jsonplaceholder.typeicode.com/users?email=${fieldValue}`);
            //   const data = await response.json()
            //   return data.length == 0 || "Email already exists"
            // }
          },

          required: "email required"
        })} type="email" />
        <p className="error">{errors.email?.message}</p>

        <label htmlFor="channel">Channel</label>
        <input id="channel" {...register("channel", { required: { value: true, message: "channel is required" } })} type="text" />
        <p className="error">{errors.channel?.message}</p>

        <label htmlFor="twitter">Twitter</label>
        <input id="twitter" {...register("social.twitter", {
          disabled: true,//if we use disable even validation for that field is also disabled and value becomes undefined
          //disabled:watch("channel")==="" if we wnat to enable if certain field is used we can write this condition
          required: "twitter is required"
        }
        )} type="text" />
        {/* <p className="error">{errors.social?.twitter?.message}</p> */}
        <label htmlFor="facebook">facebook</label>
        <input id="facebook" {...register("social.facebook")} type="text" />

        <label htmlFor="primary-phone">Primary Phone No</label>
        <input id="primary-phone" {...register("phoneNumbers.0",
          // { required: "phone number 1 is required" }
        )} type="text" />
        {/* <p className="error">{errors.phoneNumbers?.[0]?.message}</p> */}


        <label htmlFor="secondary-phone">secondary Phone No</label>
        <input id="secondary-phone" {...register("phoneNumbers.1")} type="text" />



        <div>
          <label>List of phone Numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {
                    index > 0 && (<button type="button" onClick={(() => remove(index))}>
                      Remove
                    </button>)
                  }
                </div>
              )
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add Phone Number
            </button>
          </div>
        </div>



        <label htmlFor="age">age</label>
        <input id="age" {...register("age", { valueAsNumber: true, required: { value: true, message: "age is required" } })} type="number" />
        <p className="error">{errors.age?.message}</p>



        <label htmlFor="dob">Date of Birth</label>
        <input id="dob" {...register("dob", { valueAsDate: true, required: { value: true, message: "dob is required" } })} type="date" />
        <p className="error">{errors.dob?.message}</p>

        <button disabled={!isDirty || isSubmitting} >Submit</button>
        <button type="button" onClick={handleGetValues}>Get Values</button>
        <button type="button" onClick={handleSetValues}>Set Value</button>
        <button type="button" onClick={() => reset()}>Reset</button>
        <button type="button" onClick={() => trigger()}>Manual validate Form</button>
        {/* if we passs field name for trigger or alist of field names we can trigger only those */}
      </form>
      <DevTool control={control} />
    </div>
  );
};
