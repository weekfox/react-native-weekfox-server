require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
    s.name         = "RNWeekFoxServer"
    s.version      = package['version'].gsub(/v|-beta/, '')
    s.summary      = package['description']
    s.description  = package['description']
    s.homepage     = package['homepage']
    s.license      = package['license']
    s.author       = package['author']
    s.platform     = :ios, "11.0"
    s.source       = { :git => "https://github.com/weekfox/react-native-weekfox-server.git", :tag => "v#{s.version}" }
    s.requires_arc  = true
    s.platform      = :ios, "11.0"
  
    s.preserve_paths = 'README.md', 'package.json', 'index.js'
    s.source_files   = 'ios/*.{h,m}'
  
    s.dependency 'React'
    s.dependency 'GCDWebServer', '~> 3.0'
    s.dependency 'GCDWebServer/WebUploader', '~> 3.0'
    s.dependency 'GCDWebServer/WebDAV', '~> 3.0'
  
  end
  