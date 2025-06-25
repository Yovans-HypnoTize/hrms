interface AuthLayoutProps {
    children: React.ReactNode
}
const AuthLayout:React.FC<AuthLayoutProps> = ({children}) => {
  return (
    <div className="account-body">
      <div className="col-12">
        <div className="row">
          <div className="col-6 login-left">
            <div className="login-content">
              {children}
            </div>
          </div>
          <div className="col-6 login-right align-items-center justify-content-center ">
            <div style={{ height: "auto", width: "180px" }}>
              <img
                src={window.location.origin + "/assets/images/adhiran-infotech-white-logo.png"}
                alt="adhiran infotech logo"
                className="logo-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout