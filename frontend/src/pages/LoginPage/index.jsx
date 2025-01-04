import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../store/thunkFunctions'

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ mode: 'onChange' })

  const dispatch = useDispatch();

  const onSubmit = ({ email, password }) => {

    const body = {
      email,
      password,
    }

    dispatch(loginUser(body));
    reset();
  }

  const userEmail = {
    required: 'Requried.'
  }

  const userPassword = {
    required: 'Requried.',
    minLength: {
      value: 6,
      message: 'Minimum 6 char Requried.'
    }
  }


  return (
    <section className='flexContact'>
      <div>
        <h1 className='title'>
          LOGIN
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor='email'
              className='name'
            >Email</label>
            <input
              type='email'
              id="email"
              className='inputFeild'
              {...register('email', userEmail)}
            />
            {
              errors?.email &&
              <div>
                <span className='text-red-500'>
                  {errors.email.message}
                </span>
              </div>
            }
          </div>

          <div className='mb-2'>
            <label
              htmlFor='password'
              className='name'
            >Password</label>
            <input
              type='password'
              id="password"
              className='inputFeild'
              {...register('password', userPassword)}
            />
            {
              errors?.password &&
              <div>
                <span className='text-red-500'>
                  {errors.password.message}
                </span>
              </div>
            }
          </div>

          <div className='mt-6'>
            <button type='submit' className='w-full px-4 py-2 text-white duration-200 bg-black rounded-md hover:bg-gray-700'>
              LOGIN
            </button>
          </div>

          <p className='ask'>
            Do you have no ID ?{"　"}
            <a
              href='/register'
              className='font-medium hover:underline'
            >
              REGISTER
            </a>
          </p>
        </form>
      </div>
    </section>
  )
}

export default LoginPage