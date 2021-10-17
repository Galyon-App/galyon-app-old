<?php

	/**
	 * JSON Web Token implementation, based on this spec:
	 * http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-06
	 *
	 * PHP version 5
	 *
	 * @category Authentication
	 * @package  Authentication_JWT
	 * @author   Neuman Vong <neuman@twilio.com>
	 * @author   Anant Narayanan <anant@php.net>
	 * @license  http://opensource.org/licenses/BSD-3-Clause 3-clause BSD
	 * @link     https://github.com/firebase/php-jwt
	 */

	namespace Galyon\Libraries;

	class Jwt
	{
		protected $encrypt_key;

		public function __construct($encryption = '') {
			$this->encrypt_key = $encryption;
		}

		/**
		 * Decodes a JWT string into a PHP object.
		 *
		 * @param string      $jwt    The JWT
		 * @param string|null $key    The secret key
		 * @param bool        $verify Don't skip verification process 
		 *
		 * @return object      The JWT's payload as a PHP object
		 * @throws UnexpectedValueException Provided JWT was invalid
		 * @throws DomainException          Algorithm was not provided
		 * 
		 * @uses jsonDecode
		 * @uses urlsafeB64Decode
		 */
		public function decode($jwt, $verify = true)
		{
			$tks = explode('.', $jwt);
			if (count($tks) != 3) {
				//throw new UnexpectedValueException('Wrong number of segments');
				return false;
			}
			list($headb64, $bodyb64, $cryptob64) = $tks;
			if (null === ($header = $this->jsonDecode($this->urlsafeB64Decode($headb64)))) {
				//throw new UnexpectedValueException('Invalid segment encoding');
				return false;
			}
			if (null === $payload = $this->jsonDecode($this->urlsafeB64Decode($bodyb64))) {
				//throw new UnexpectedValueException('Invalid segment encoding');
				return false;
			}
			$sig = $this->urlsafeB64Decode($cryptob64);
			if ($verify) {
				if (empty($header->alg)) {
					//throw new DomainException('Empty algorithm');
					return false;
				}
				if ($sig != $this->sign("$headb64.$bodyb64", $header->alg)) {
					//throw new UnexpectedValueException('Signature verification failed');
					return false;
				}
			}
			return $payload;
		}

		/**
		 * Converts and signs a PHP object or array into a JWT string.
		 *
		 * @param object|array $payload PHP object or array
		 * @param string       $key     The secret key
		 * @param string       $algo    The signing algorithm. Supported
		 *                              algorithms are 'HS256', 'HS384' and 'HS512'
		 *
		 * @return string      A signed JWT
		 * @uses jsonEncode
		 * @uses urlsafeB64Encode
		 */
		public function encode($payload, $algo = 'HS256')
		{
			$header = array('typ' => 'JWT', 'alg' => $algo);

			$segments = array();
			$segments[] = $this->urlsafeB64Encode($this->jsonEncode($header));
			$segments[] = $this->urlsafeB64Encode($this->jsonEncode($payload));
			$signing_input = implode('.', $segments);

			$signature = $this->sign($signing_input, $algo);
			$segments[] = $this->urlsafeB64Encode($signature);

			return implode('.', $segments);
		}

		/**
		 * Sign a string with a given key and algorithm.
		 *
		 * @param string $msg    The message to sign
		 * @param string $key    The secret key
		 * @param string $method The signing algorithm. Supported
		 *                       algorithms are 'HS256', 'HS384' and 'HS512'
		 *
		 * @return string          An encrypted message
		 * @throws DomainException Unsupported algorithm was specified
		 */
		public function sign($msg, $method = 'HS256')
		{
			$methods = array(
				'HS256' => 'sha256',
				'HS384' => 'sha384',
				'HS512' => 'sha512',
			);
			if (empty($methods[$method])) {
				throw new DomainException('Algorithm not supported');
			}
			return hash_hmac($methods[$method], $msg, $this->encrypt_key, true);
		}

		/**
		 * Decode a JSON string into a PHP object.
		 *
		 * @param string $input JSON string
		 *
		 * @return object          Object representation of JSON string
		 * @throws DomainException Provided string was invalid JSON
		 */
		public function jsonDecode($input)
		{
			$obj = json_decode($input);
			if (function_exists('json_last_error') && $errno = json_last_error()) {
				$this->_handleJsonError($errno);
			} else if ($obj === null && $input !== 'null') {
				throw new DomainException('Null result with non-null input');
			}
			return $obj;
		}

		/**
		 * Encode a PHP object into a JSON string.
		 *
		 * @param object|array $input A PHP object or array
		 *
		 * @return string          JSON representation of the PHP object or array
		 * @throws DomainException Provided object could not be encoded to valid JSON
		 */
		public function jsonEncode($input)
		{
			$json = json_encode($input);
			if (function_exists('json_last_error') && $errno = json_last_error()) {
				$this->_handleJsonError($errno);
			} else if ($json === 'null' && $input !== null) {
				throw new DomainException('Null result with non-null input');
			}
			return $json;
		}

		/**
		 * Decode a string with URL-safe Base64.
		 *
		 * @param string $input A Base64 encoded string
		 *
		 * @return string A decoded string
		 */
		public function urlsafeB64Decode($input)
		{
			$remainder = strlen($input) % 4;
			if ($remainder) {
				$padlen = 4 - $remainder;
				$input .= str_repeat('=', $padlen);
			}
			return base64_decode(strtr($input, '-_', '+/'));
		}

		/**
		 * Encode a string with URL-safe Base64.
		 *
		 * @param string $input The string you want encoded
		 *
		 * @return string The base64 encode of what you passed in
		 */
		public function urlsafeB64Encode($input)
		{
			return str_replace('=', '', strtr(base64_encode($input), '+/', '-_'));
		}

		/**
		 * Helper method to create a JSON error.
		 *
		 * @param int $errno An error number from json_last_error()
		 *
		 * @return void
		 */
		private function _handleJsonError($errno)
		{
			$messages = array(
				JSON_ERROR_DEPTH => 'Maximum stack depth exceeded',
				JSON_ERROR_CTRL_CHAR => 'Unexpected control character found',
				JSON_ERROR_SYNTAX => 'Syntax error, malformed JSON'
			);
			throw new DomainException(
				isset($messages[$errno])
				? $messages[$errno]
				: 'Unknown JSON error: ' . $errno
			);
		}

	}