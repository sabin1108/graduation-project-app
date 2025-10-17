# 사이드바(Sidebar) 터치 오류 수정 내역

## 문제점

사이드바를 스와이프(swipe)하여 닫는 동작을 할 때, 손가락의 움직임이 사이드바 내의 링크나 메뉴 항목에 대한 '클릭(press)'으로 잘못 인식되는 문제가 있었습니다. 이로 인해 사용자가 의도하지 않은 화면으로 이동하거나 기능이 실행되는 오류가 발생했습니다.

## 해결 방안

이 문제를 해결하기 위해, 사이드바가 **완전히 열려 있는 상태**에서만 메뉴 항목의 터치 입력을 받도록 수정했습니다.

## 수정 내용

1.  **사이드바 상태 확인**: `@react-navigation/drawer` 라이브러리에서 제공하는 `useDrawerStatus` 훅(hook)을 사용하여 사이드바의 현재 상태를 실시간으로 확인합니다. 사이드바의 상태는 '열림'(`open`), '닫힘'(`closed`), 또는 '움직이는 중'일 수 있습니다.

2.  **조건부 `onPress` 핸들러 적용**: `useDrawerStatus`가 반환하는 상태값이 `'open'`이 아닐 경우 (즉, 사이드바가 닫혀있거나 움직이는 중일 때), 메뉴 항목의 `onPress` 핸들러가 실행되지 않도록 조건을 추가했습니다.

    - **기존 코드 (예시):**
      ```jsx
      <List.Item
        title="설정"
        onPress={() => { /* ... */ }}
      />
      ```

    - **수정된 코드 (예시):**
      ```jsx
      const drawerStatus = useDrawerStatus();
      const isDrawerOpen = drawerStatus === 'open';

      <List.Item
        title="설정"
        onPress={() => {
          if (isDrawerOpen) {
            // 원래의 onPress 로직
            props.navigation.navigate('settings');
          }
        }}
      />
      ```
    이전에는 `disabled` prop을 사용하려 했으나, `react-native-paper`의 `List.Item` 및 `List.Accordion` 컴포넌트가 해당 prop을 직접 지원하지 않아 `onPress` 핸들러를 조건부로 변경하는 방식으로 수정되었습니다.

## 기대 효과

이제 사이드바를 스와이프하여 닫는 동안에는 메뉴 항목들이 일시적으로 비활성화되어, 의도치 않은 링크 클릭이나 메뉴 이동이 발생하는 문제가 해결되었습니다. 사용자는 더 안정적으로 앱을 조작할 수 있습니다.
