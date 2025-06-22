namespace AUTH {
	 type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CITIZEN' | 'ADMIN';
  };

  type GetResponse = {
    user: User;
  };
	
	type GetRequest = void;

	type PostLoginResponse = {
		accessToken: string;
		accessTokenExpiration: number;
		refreshToken: string
	};
	
	type PostLoginRequest = {
		email: string;
		password: string;
	};

	 type PostRegistrationResponse = {
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      email: string;
      lastName: string;
      firstName: string;
      role: string;
    };
  };

  type PostRegistrationRequest = {
    email: string;
    password: string;
    lastName: string;
    firstName: string;
  };

	type PostLogoutResponse = {
		message: string;
	};
	type PostLogoutRequest = void;

	type PatchRefreshResponse = {
		accessToken: string;
		accessTokenExpiration: number;
	};
	type PatchRefreshRequest = void;

	type PostForgotPasswordResponse = {
		message: string;
	};
	type PostForgotPasswordRequest = {
		email: string;
		frontEndUrl: string;
	};

	type PatchResetPasswordResponse = {
		message: string;
	};
	type PatchResetPasswordRequest = {
		token: string;
		newPassword: string;
	};
}

