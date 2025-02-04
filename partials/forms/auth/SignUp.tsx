"use client";

import React, { useState } from "react";

import {
	Anchor,
	Box,
	Button,
	Card,
	Center,
	Divider,
	Grid,
	GridCol,
	Group,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Transition,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import LayoutSection from "@/layouts/Section";
import AuthProviders from "@/partials/auth/Providers";
import AuthHeader from "@/partials/auth/Header";

import email from "@/libraries/validators/special/email";
import password from "@/libraries/validators/special/password";

import compare from "@/libraries/validators/special/compare";

import { signIn as authSignIn } from "next-auth/react";
import { authVerify as handleVerification, authSignIn as handleSignin, authVerifyResend } from "@/handlers/auth";
import { millToMinSec } from "@/handlers/parsers/number";
import Brand from "@/components/Brand";
import Link from "next/link";

export default function SignUp({ userEmail }: { userEmail?: string }) {
	const [submitted, setSubmitted] = useState(false);
	const [verify, setverify] = useState(userEmail ? true : false);

	const switchContext = async () => {
		form2.reset();
		setverify(!verify);
	};

	// notifications
	const notification = {
		noResponse: {
			id: "otp-verify-failed-no-response",
			icon: <IconX size={16} stroke={1.5} />,
			title: "Server Unreachable",
			message: `Check your network connection.`,
			variant: "failed",
		},
		unauthorized: {
			id: "otp-request-failed-not-found",
			icon: <IconX size={16} stroke={1.5} />,
			title: "Unauthorized",
			message: `You are not allowed to perform this action.`,
			variant: "failed",
		},
		verified: {
			id: "otp-request-info-already-verified",
			icon: <IconCheck size={16} stroke={1.5} />,
			title: "Verified",
			message: `The email has already been verified`,
			variant: "success",
		},
	};

	// form 1 logic
	const form = useForm({
		initialValues: {
			email: "",
			password: "",
			passwordConfirm: "",
		},

		validate: {
			email: value => email(value.trim()),
			password: value => password(value.trim(), 8, 24),
			passwordConfirm: (value, values) => compare.string(values.password, value, "Password"),
		},
	});

	const parse = () => {
		return {
			email: form.values.email.trim().toLowerCase(),
			password: form.values.password.trim(),
			unverified: true,
		};
	};

	const handleSignUp = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const response = await handleSignin(parse());

				const res = await response.json();

				if (!res) {
					notifications.show(notification.noResponse);
				} else {
					if (res.user.exists == false) {
						setSubmitted(false);
						switchContext();
					} else {
						if (res.user.verified == false) {
							switchContext();
						} else {
							notifications.show({
								id: "sign-up-failed-exists",
								icon: <IconX size={16} stroke={1.5} />,
								title: "Account Exists",
								message: "An account with that email already exists",
								variant: "failed",
							});

							// redirect to sign in
							form.reset();
							await authSignIn();
						}
					}
				}
			} catch (error) {
				console.error("X-> Error:", (error as Error).message);

				notifications.show({
					id: "sign-up-failed",
					icon: <IconX size={16} stroke={1.5} />,
					title: "Sign Up Failed",
					message: (error as Error).message,
					variant: "failed",
				});

				form.reset();
			} finally {
				setSubmitted(false);
			}
		}
	};

	// form 2 logic

	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<
		| {
				minutes: string;
				seconds: string;
		  }
		| undefined
	>(undefined);

	const form2 = useForm({
		initialValues: {
			otp: "",
		},

		validate: {
			otp: value => (value.length < 1 ? "A code is required" : value.length == 4 ? null : "Invalid code"),
		},
	});

	const parse2 = () => {
		return { otp: form2.values.otp, email: userEmail ? userEmail : form.values.email };
	};

	const handleVerify = async () => {
		try {
			if (form2.isValid()) {
				setSubmitted(true);

				const res = await handleVerification(parse2());

				if (!res) {
					notifications.show(notification.noResponse);
				} else {
					if (!res.user.exists) {
						notifications.show(notification.unauthorized);

						// revert context
						form.reset();
						switchContext();
					} else {
						if (!res.user.verified) {
							if (!res.otp.exists) {
								notifications.show({
									id: "otp-verify-failed-expired",
									icon: <IconX size={16} stroke={1.5} />,
									title: "No OTP Found",
									message: `Request another OTP in the link provided on this page`,
									variant: "failed",
								});

								form2.reset();
							} else {
								if (!res.otp.matches) {
									notifications.show({
										id: "otp-verify-failed-mismatch",
										icon: <IconX size={16} stroke={1.5} />,
										title: "Wrong OTP",
										message: `You have entered the wrong OTP for this email.`,
										variant: "failed",
									});

									form2.reset();
								} else {
									if (!res.otp.expired) {
										notifications.show({
											id: "otp-verify-success",
											icon: <IconCheck size={16} stroke={1.5} />,
											title: "Account Created",
											message: `You can now log in to your account.`,
											variant: "success",
										});

										// redirect to sign in
										form.reset();
										form2.reset();
										await authSignIn();
									} else {
										notifications.show({
											id: "otp-verify-failed-expired",
											icon: <IconX size={16} stroke={1.5} />,
											title: "OTP Expired",
											message: `Request another in the link provided on this page`,
											variant: "failed",
										});

										form2.reset();
									}
								}
							}
						} else {
							notifications.show(notification.verified);

							// redirect to sign in
							form.reset();
							form2.reset();
							await authSignIn();
						}
					}
				}
			}
		} catch (error) {
			console.error("X-> Error:", (error as Error).message);

			notifications.show({
				id: "otp-verify-failed",
				icon: <IconX size={16} stroke={1.5} />,
				title: `Verification Failed`,
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setSubmitted(false);
		}
	};

	const handleRequest = async () => {
		try {
			setRequested(true);

			const response = await authVerifyResend({ email: form.values.email });

			const res = await response.json();

			if (!res) {
				notifications.show(notification.noResponse);
			} else {
				if (!res.user.exists) {
					notifications.show(notification.unauthorized);

					// revert context
					form.reset();
					switchContext();
				} else {
					if (!res.user.verified) {
						if (!res.otp.exists) {
							// // test new otp value response
							// console.log(res.otp.value);

							notifications.show({
								id: "otp-request-success-new-otp-created",
								icon: <IconCheck size={16} stroke={1.5} />,
								title: "New OTP Sent",
								message: `A new code has been sent to the provided email.`,
								variant: "success",
							});

							form2.reset();
						} else {
							if (!res.otp.expired) {
								setTime(millToMinSec(res.otp.expiry));

								// // test otp tte response
								// console.log(res.otp.time);

								!time &&
									notifications.show({
										id: "otp-request-failed-not-expired",
										icon: <IconX size={16} stroke={1.5} />,
										title: "OTP Already Sent",
										message: `Remember to check your spam/junk folder(s).`,
										variant: "failed",
									});
							} else {
								// // test new otp value response
								// console.log(res.otp.value);

								notifications.show({
									id: "otp-request-success",
									icon: <IconCheck size={16} stroke={1.5} />,
									title: "New OTP Sent",
									message: `A new code has been sent to the provided email.`,
									variant: "success",
								});

								form2.reset();
							}
						}
					} else {
						notifications.show(notification.verified);

						// redirect to sign in
						form.reset();
						form2.reset();
						await authSignIn();
					}
				}
			}
		} catch (error) {
			console.error("X-> Error:", (error as Error).message);

			notifications.show({
				id: "otp-request-failed",
				icon: <IconX size={16} stroke={1.5} />,
				title: "Request Failed",
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setRequested(false);
		}
	};

	return (
		<>
			<Transition mounted={!verify} transition="fade" duration={0}>
				{styles => (
					<div style={styles}>
						<LayoutSection padded containerized={"xs"}>
							<Stack gap={40}>
								<Group justify="center">
									<Link href={"/"}>
										<Brand height={32} />
									</Link>
								</Group>

								<Box component="form" onSubmit={form.onSubmit(values => handleSignUp())} noValidate>
									<Stack gap={40}>
										<Card withBorder>
											<Stack>
												<AuthHeader
													data={{
														title: "Create Your account",
														desc: `Enter your details to create an account.`,
													}}
												/>

												<Divider />

												<Grid>
													<GridCol span={{ base: 12, sm: 12 }}>
														<TextInput
															required
															label={"Email"}
															placeholder="Your Email"
															{...form.getInputProps("email")}
														/>
													</GridCol>
													<GridCol span={{ base: 12, xs: 12 }}>
														<PasswordInput
															required
															label={"Password"}
															placeholder="Your password"
															{...form.getInputProps("password")}
														/>
													</GridCol>
													<GridCol span={{ base: 12, xs: 12 }}>
														<PasswordInput
															required
															label={"Confirm Password"}
															placeholder="Confirm your password"
															{...form.getInputProps("passwordConfirm")}
														/>
													</GridCol>
													<GridCol span={12} mt={"lg"}>
														<Center>
															<Button
																w={{ base: "100%", xs: "50%", md: "100%" }}
																type="submit"
																loading={submitted}
															>
																{submitted ? "Signing Up" : "Sign Up"}
															</Button>
														</Center>
													</GridCol>
												</Grid>
											</Stack>
										</Card>

										<Divider label="or continue with" />

										<AuthProviders />

										<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
											Already have an account?{" "}
											<Anchor
												inherit
												fw={500}
												underline="hover"
												onClick={async e => {
													e.preventDefault();
													await authSignIn();
												}}
											>
												Sign In
											</Anchor>
										</Text>
									</Stack>
								</Box>
							</Stack>
						</LayoutSection>
					</div>
				)}
			</Transition>

			<Transition mounted={verify} transition="fade" duration={0}>
				{styles => (
					<div style={styles}>
						<LayoutSection padded containerized={"xs"}>
							<Stack gap={40}>
								<Group justify="center">
									<Link href={"/"}>
										<Brand height={32} />
									</Link>
								</Group>

								<Box component="form" onSubmit={form2.onSubmit(values => handleVerify())} noValidate>
									<Stack gap={"xl"}>
										<Card withBorder>
											<Stack>
												<AuthHeader
													data={{
														title: "Verify Your Account",
														desc: `Enter the code sent to the provided email.`,
													}}
												/>

												<Divider />

												<Grid>
													<GridCol span={{ base: 12 }}>
														<Stack gap={4} align="end">
															<TextInput
																required
																label={`One-time Code`}
																placeholder="Your Code"
																{...form2.getInputProps("otp")}
																w={"100%"}
															/>
															<Anchor
																underline="hover"
																inherit
																fz={"xs"}
																ta={"end"}
																w={"fit-content"}
																onClick={() => switchContext()}
															>
																Change email
															</Anchor>
														</Stack>
													</GridCol>
													<GridCol span={{ base: 12 }}>
														<Grid mt={"md"}>
															<GridCol span={{ base: 12, xs: 6 }}>
																<Button
																	fullWidth
																	loading={requested}
																	variant="light"
																	onClick={() => handleRequest()}
																>
																	{requested ? "Requesting" : "Request Another"}
																</Button>
															</GridCol>
															<GridCol span={{ base: 12, xs: 6 }}>
																<Button fullWidth type="submit" loading={submitted}>
																	{submitted ? "Verifying" : "Verify"}
																</Button>
															</GridCol>
														</Grid>
													</GridCol>
												</Grid>
											</Stack>
										</Card>

										<Transition mounted={time != undefined} transition="fade" duration={0}>
											{styles => (
												<Box
													style={{ ...styles, transition: "0.25s all ease" }}
													opacity={requested ? "0" : "1"}
												>
													<Stack ta={"center"} fz={{ base: "xs", xs: "sm" }}>
														<Text c={"dimmed"} inherit>
															If the email you provided is valid, you should have received
															it. Remember to check your spam/junk folder(s).
														</Text>
														<Text c={"dimmed"} inherit>
															You can otherwise request another code in{" "}
															<Text component="span" inherit c={"pri"} fw={500}>
																{time?.minutes} minutes
															</Text>
															.
														</Text>
													</Stack>
												</Box>
											)}
										</Transition>
									</Stack>
								</Box>
							</Stack>
						</LayoutSection>
					</div>
				)}
			</Transition>
		</>
	);
}
