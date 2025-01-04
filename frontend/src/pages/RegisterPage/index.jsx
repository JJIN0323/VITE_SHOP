import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../store/thunkFunctions'

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ mode: 'onChange' })
  const dispatch = useDispatch();

  const onSubmit = ({ email, password, name }) => {

    const body = {
      email,
      password,
      name,
      image: `https://via.placeholder.com/600x400?text=no+user+image`
    }

    dispatch(registerUser(body));

    reset();
  }

  const userEmail = {
    required: 'Required.'
  }
  const userName = {
    required: 'Required.'
  }
  const userPassword = {
    required: 'Required.',
    minLength: {
      value: 6,
      message: 'Mininum 6 char.'
    }
  }

  return (
    <section className='flexContact'>
      <div className='p-6 bg-white rounded-md shadow-md'>
        <h1 className='title'>
          REGISTER
        </h1>
        <form className='mt-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label
              htmlFor='email'
              className='name'
            >E-mail</label>
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
              htmlFor='name'
              className='name'
            >Name</label>
            <input
              type='text'
              id="name"
              className='inputFeild'
              {...register('name', userName)}
            />
            {
              errors?.name &&
              <div>
                <span className='text-red-500'>
                  {errors.name.message}
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
            <button type='submit' className='submit'>
              OK
            </button>
          </div>

          <p className='ask'>
            Already ID?{' '}
            <a
              href='/login'
              className='font-medium hover:underline'
            >
              LOGIN
            </a>
          </p>
        </form>
      </div>
    </section>
  )
}

export default RegisterPage