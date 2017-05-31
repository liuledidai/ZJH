
#include "BSDSocket.h"
#include <stdio.h>
#include "poll.h"

#ifdef WIN32
	#pragma comment(lib, "wsock32")
#endif


CBSDSocket::CBSDSocket(SOCKET sock)
{
	m_sock = sock;
}

CBSDSocket::~CBSDSocket()
{
}

int CBSDSocket::Init()
{
#ifdef WIN32
	/*
	http://msdn.microsoft.com/zh-cn/vstudio/ms741563(en-us,VS.85).aspx

	typedef struct WSAData { 
		WORD wVersion;								//winsock version
		WORD wHighVersion;							//The highest version of the Windows Sockets specification that the Ws2_32.dll can support
		char szDescription[WSADESCRIPTION_LEN+1]; 
		char szSystemStatus[WSASYSSTATUS_LEN+1]; 
		unsigned short iMaxSockets; 
		unsigned short iMaxUdpDg; 
		char FAR * lpVendorInfo; 
	}WSADATA, *LPWSADATA; 
	*/
	WSADATA wsaData;
	//#define MAKEWORD(a,b) ((WORD) (((BYTE) (a)) | ((WORD) ((BYTE) (b))) << 8)) 
	WORD version = MAKEWORD(2, 0);
	int ret = WSAStartup(version, &wsaData);//win sock start up
	if ( ret ) {
//		cerr << "Initilize winsock error !" << endl;
		return -1;
	}
#endif
	
	return 0;
}
//this is just for windows
int CBSDSocket::Clean()
{
#ifdef WIN32
		return (WSACleanup());
#endif
		return 0;
}

CBSDSocket& CBSDSocket::operator = (SOCKET s)
{
	m_sock = s;
	return (*this);
}

CBSDSocket::operator SOCKET ()
{
	return m_sock;
}

bool CBSDSocket::Connect(const char* domain, unsigned short port)
{
    std::vector<std::string> ips;
    
    struct addrinfo hints, *pAddr;
    memset(&hints, 0, sizeof(hints));
    hints.ai_family = PF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_PASSIVE;
    hints.ai_protocol = IPPROTO_IP;
    
    int error = getaddrinfo(domain, nullptr, &hints, &pAddr);
    if (error != 0 )
    {
        printf("getaddrinfo: %s\n", gai_strerror(error));
        return false;
    }
    
    m_sock = socket(pAddr->ai_family, SOCK_STREAM, 0);
    if ( m_sock == INVALID_SOCKET )
    {
        freeaddrinfo(pAddr);
        return false;
    }
    
    if (pAddr->ai_family == AF_INET)
    {
        struct sockaddr_in* ipv4 = nullptr;
        char str[32] = {0};
        for (auto iter = pAddr; iter != nullptr; iter = iter->ai_next)
        {
            ipv4 = (struct sockaddr_in*)iter->ai_addr;
            inet_ntop(AF_INET, &ipv4->sin_addr, str, 32);
            ips.push_back(str);
        }
    }
    else if(pAddr->ai_family == AF_INET6)
    {
        struct sockaddr_in6* ipv6 = nullptr;
        char str[40] = {0};
        for (auto iter = pAddr; iter != nullptr; iter = iter->ai_next)
        {
            ipv6 = (struct sockaddr_in6*)iter->ai_addr;
            inet_ntop(AF_INET6, &ipv6->sin6_addr, str, 40);
            ips.push_back(str);
        }
    }
    
    int nRet;
    std::vector<std::string> ipVector = ips;
    if (pAddr->ai_family == AF_INET6)
    {
        for (auto iter = ipVector.begin(); iter!= ipVector.end(); iter++)
        {
            std::string ip = iter->c_str();
            sockaddr_in6 sa = {0};
            struct in6_addr addr = {0};
            inet_pton(pAddr->ai_family, ip.c_str(), &addr);
            
            sa.sin6_family = pAddr->ai_family;
            sa.sin6_port = htons(port);
            sa.sin6_addr = addr;
            
            nRet = ::connect(m_sock, (sockaddr*)&sa, sizeof(sa));
            
            if (nRet == 0) break;
        }
    }
    else
    {
        std::string ip = ipVector.at(0);
        sockaddr_in sa = {0};
        struct in_addr addr = {0};
        inet_pton(pAddr->ai_family, ip.c_str(), &addr);
        
        sa.sin_family = pAddr->ai_family;
        sa.sin_port = htons(port);
        sa.sin_addr = addr;
        
        nRet = ::connect(m_sock, (sockaddr*)&sa, sizeof(sa));
    }

    freeaddrinfo(pAddr);
    
    if ( nRet == SOCKET_ERROR )
    {
        if(errno == EINTR) {
            if(check_conn_is_ok(m_sock) < 0) {
                perror("connect");
                return false;
            }
            else {
                printf("connect is success!\n");
                return  true;
            }
        }
        else {
            perror("connect");
            return false;
        }
    }
    return true;
}

bool CBSDSocket::Connect(struct sockaddr_in svraddr)
{
	int ret = connect(m_sock, (struct sockaddr*)&svraddr, sizeof(svraddr));
	if ( ret == SOCKET_ERROR )
    {
//        struct pollfd unix_really_sucks;
//        int some_more_junk;
//        socklen_t yet_more_useless_junk;
//        
//        if ( errno != EINTR /* && errno != EINPROGRESS */ )
//        {
//            perror ("connect");
//            exit (EXIT_FAILURE);
//        }
//        unix_really_sucks.fd = m_sock;
//        unix_really_sucks.events = POLLOUT;
//        while ( poll (&unix_really_sucks, 1, -1) == -1 )
//            if ( errno != EINTR )
//            {
//                perror ("poll");
//                exit (EXIT_FAILURE);
//            }
//        yet_more_useless_junk = sizeof(some_more_junk);
//        if ( getsockopt (m_sock, SOL_SOCKET, SO_ERROR,
//                         &some_more_junk,
//                         &yet_more_useless_junk) == -1 )
//        {
//            perror ("getsockopt");
//            exit (EXIT_FAILURE);
//        }
//        if ( some_more_junk != 0 )
//        {
//            fprintf (stderr, "connect: %s\n",
//                     strerror (some_more_junk));
//            exit (EXIT_FAILURE);
//        }
		return false;
	}
	return true;
}


bool CBSDSocket::isLocalWIFI()
{
#ifdef WIN32
    //添加win32检测方法
    
    
    return false;

#endif
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

    //ios下检测是否wifi
    struct ifaddrs *addresses;
    struct ifaddrs *cursor;
    bool wiFiAvailable = false;
//    
//    if (getifaddrs(&addresses) != 0) return wiFiAvailable;
//    
//    cursor = addresses;
//    while (cursor != NULL)
//    {
//    	if (cursor -> ifa_addr -> sa_family == AF_INET && !(cursor -> ifa_flags & IFF_LOOPBACK)) // Ignore the loopback address
//    	{
//    		// Check for WiFi adapter
//    		if (strcmp(cursor -> ifa_name, "en0") == 0)
//            {
//    			wiFiAvailable = true;
//    			break;
//    		}
//    	}
//    	cursor = cursor -> ifa_next;
//    }
//    
//    freeifaddrs(addresses);

    return wiFiAvailable;
    
#endif
    
    return false;
}



bool CBSDSocket::Bind(unsigned short port)
{
	struct sockaddr_in svraddr;
	svraddr.sin_family = AF_INET;
	svraddr.sin_addr.s_addr = INADDR_ANY;
	svraddr.sin_port = htons(port);

	int opt =  1;
	if ( setsockopt(m_sock, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt)) < 0 ) 
		return false;

	int ret = bind(m_sock, (struct sockaddr*)&svraddr, sizeof(svraddr));
	if ( ret == SOCKET_ERROR ) {
		return false;
	}
	return true;
}

//for server
bool CBSDSocket::Listen(int backlog)
{
	int ret = listen(m_sock, backlog);
	if ( ret == SOCKET_ERROR ) {
		return false;
	}
	return true;
}

bool CBSDSocket::Accept(CBSDSocket& s, char* fromip)
{
	struct sockaddr_in cliaddr;
	socklen_t addrlen = sizeof(cliaddr);
	SOCKET sock = accept(m_sock, (struct sockaddr*)&cliaddr, &addrlen);
	if ( sock == SOCKET_ERROR ) {
		return false;
	}

	s = sock;
	if ( fromip != NULL )
		sprintf(fromip, "%s", inet_ntoa(cliaddr.sin_addr));

	return true;
}

int CBSDSocket::Send(const char* buf, int len, int flags)
{
	int bytes;
	int count = 0;

	while( count < len )
    {
		bytes = (int)send(m_sock, buf + count, len - count, flags);
		if ( bytes == -1 || bytes == 0 )
			return -1;
        
		count += bytes;
	} 

	return count;
}

int CBSDSocket::Recv(char* buf, int len, int flags)
{
	return (int)(recv(m_sock, buf, len, flags));
}

int CBSDSocket::Close()
{
#ifdef WIN32
	return (closesocket(m_sock));
#endif
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS) 
    shutdown(m_sock, 2);
	return (close(m_sock));
#endif
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    shutdown(m_sock, 2);
    return (close(m_sock));
#endif
}

int CBSDSocket::GetError()
{
#ifdef WIN32
	return (WSAGetLastError());
#else
	return (errno);
#endif
}


int check_conn_is_ok(SOCKET sock) {
	struct pollfd fd;
	int ret = 0;
	socklen_t len = 0;
    
	fd.fd = sock;
	fd.events = POLLOUT;
    
	while ( poll (&fd, 1, -1) == -1 ) {
		if( errno != EINTR ){
			perror("poll");
			return -1;
		}
	}
    
	len = sizeof(ret);
	if ( getsockopt (sock, SOL_SOCKET, SO_ERROR,
                     &ret,
                     &len) == -1 ) {
        perror("getsockopt");
		return -1;
	}
    
	if(ret != 0) {
		fprintf (stderr, "socket %d connect failed: %s\n",
                 sock, strerror (ret));
		return -1;
	}
    
	return 0;
    
}
