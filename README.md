# 8086 Online IDE & MASM Emulator

An enhanced 8086 assembler, linker, and emulator with full **MASM syntax support**, available as a modern **Web IDE** (Next.js + CodeMirror) and a **Terminal CLI** (React Ink).

Write 8086 assembly in traditional MASM segmented format or compact flat format, compile to bytecode, and step through execution with real-time register, RAM, stack, and virtual console inspection.

---

## Highlights & MASM Enhancements

This fork adds full support for traditional **Microsoft Macro Assembler (MASM)** and DOS segmented architecture:

- **Full Segment Declarations**:
  - `SEGMENT` / `ENDS` block definitions with alignment, combine type, and class (e.g. `STACK0 SEGMENT PARA STACK 'STACK'`, `DATA SEGMENT`, `CODE SEGMENT`).
  - Automatic segment base paragraph assignment (e.g., `SS=0100h`, `DS=0200h`, `CS=0300h`).
  - Segment base evaluation in expressions (e.g., `MOV AX, DATA` loads `DATA`'s paragraph number, `MOV DS, AX` sets data segment).
- **Simplified Segment Directives**:
  - `.MODEL SMALL` / `.STACK 100H` / `.DATA` / `.CODE`
  - Predefined segment alias macros `@DATA`, `@CODE`, `@STACK`.
- **Segment Association & Program Entry**:
  - `ASSUME CS:CODE, DS:DATA, SS:STACK0` directive support.
  - `END <label>` entry point resolution to configure initial `CS` and `IP`.
  - Automatic `SS:SP` stack initialization based on `STACK` segment size.
- **Procedures**:
  - MASM-style `<name> PROC [NEAR|FAR]` and `<name> ENDP`.
  - Backward-compatible with original `PROC <name>` / `ENDP` syntax.
- **DOS 21h Program Termination**:
  - `MOV AX, 4C00H; INT 21H` / `MOV AH, 4CH; INT 21H` graceful process exit.
  - Preserves CPU registers and RAM state upon termination for post-run inspection.
- **Advanced Data & Pointer Directives**:
  - `DB`, `DW`, and `DD` (32-bit doubleword) allocation.
  - Uninitialized allocations with `?` (e.g., `VAR DW ?`, `DW 100H DUP(?)`).
  - Anonymous array allocations (`DW 100H DUP(?)` without label).
  - `EQU` constant definitions (e.g., `BUFFER_SIZE EQU 256`).
  - Explicit size qualifiers: `WORD PTR [...]`, `BYTE PTR [...]`, and bracketed variable dereference `[VAR]`.
  - Real-mode segmented string printing via `INT 21H AH=09H` with `(DS << 4) + DX`.

---

## MASM Example

The following standard MASM segmented program compiles and runs out of the box:

```assembly
STACK0 SEGMENT PARA STACK 'STACK'
    DW 100H DUP(?)
STACK0 ENDS

DATA SEGMENT
    NUM1   DW 1234H
    NUM2   DW 0005H
    RESULT DW ?
DATA ENDS

CODE SEGMENT
    ASSUME CS:CODE, DS:DATA, SS:STACK0

START:
    ; Set up Data Segment
    MOV AX, DATA
    MOV DS, AX

    ; Perform calculation via procedure
    MOV AX, NUM1
    MOV BX, NUM2
    CALL ADD_VALUES
    MOV RESULT, AX

    ; Clean DOS program exit
    MOV AX, 4C00H
    INT 21H

ADD_VALUES PROC NEAR
    ADD AX, BX
    RET
ADD_VALUES ENDP

CODE ENDS
END START
```

Simplified model syntax is also fully supported:

```assembly
.MODEL SMALL
.STACK 100H

.DATA
    MSG DB 'Hello, MASM!$'

.CODE
START:
    MOV AX, @DATA
    MOV DS, AX

    LEA DX, MSG
    MOV AH, 09H
    INT 21H

    MOV AX, 4C00H
    INT 21H
END START
```

---

## Quick Start

### Prerequisites
- Node.js >= 18
- pnpm >= 9

### Installation

```bash
git clone https://github.com/<your-username>/vgath-8086.git
cd vgath-8086

# Install dependencies
pnpm install

# Build core packages
pnpm --filter @emu8086/shared build
pnpm --filter @emu8086/emulator build
pnpm --filter @emu8086/compiler build
```

### Running the Web IDE

```bash
pnpm --filter @emu8086/web dev
# or
cd apps/web && pnpm dev
```

Visit [http://localhost:3000/ide](http://localhost:3000/ide) to write, compile, and step-debug 8086 code. You can also select the **MASM Segments & Procedures** preset from the examples menu.

### Running in the Terminal (CLI)

```bash
pnpm --filter @emu8086/cli start packages/cli/examples/hello.asm
```

### Running Tests

```bash
# Run all 263 unit and integration tests across all packages
pnpm test
```

---

## Monorepo Layout

```text
vgath-8086/
├── packages/
│   ├── shared/     — Shared types, instruction mnemonics, and example library
│   ├── compiler/   — Lexer, MASM preprocessor, syntax analyzer, segmented linker, encoder
│   ├── emulator/   — 8086 CPU core (registers, real-mode memory segmentation, opcodes, interrupts)
│   ├── react/      — React hooks for compiler, emulator, memory inspection, and source highlighting
│   ├── cli/        — Interactive terminal UI built with React Ink
│   └── feature-tests/ — Integration tests for 8086 instruction set and MASM execution
└── apps/
    └── web/        — Next.js Web IDE with CodeMirror, register/flag inspector, and memory viewer
```

---

## Supported 8086 Instruction Set

| Category | Instructions |
|---|---|
| **Data Transfer** | `MOV`, `XCHG`, `LEA`, `PUSH`, `POP`, `PUSHF`, `POPF` |
| **Arithmetic** | `ADD`, `SUB`, `MUL`, `DIV`, `NEG`, `INC`, `DEC`, `CMP` |
| **Logic & Bitwise** | `AND`, `OR`, `XOR`, `NOT`, `TEST`, `SHL`/`SAL`, `SHR`, `SAR`, `ROL`, `ROR`, `RCL`, `RCR` |
| **Control Flow** | `JMP`, `CALL`, `RET`, `LOOP`, `LOOPE`/`LOOPZ`, `LOOPNE`/`LOOPNZ` |
| **Conditionals** | `JE`/`JZ`, `JNE`/`JNZ`, `JG`/`JNLE`, `JGE`/`JNL`, `JL`/`JNGE`, `JLE`/`JNG`, `JA`/`JNBE`, `JAE`/`JNB`, `JB`/`JNAE`, `JBE`/`JNA`, `JS`, `JNS`, `JO`, `JNO`, `JP`/`JPE`, `JNP`/`JPO`, `JCXZ` |
| **String Operations** | `MOVSB`, `MOVSW`, `LODSB`, `LODSW`, `STOSB`, `STOSW`, `CMPSB`, `CMPSW`, `SCASB`, `SCASW`, `REP`, `REPE`, `REPNE` |
| **Flags** | `CLC`, `STC`, `CMC`, `CLD`, `STD` |
| **Interrupts** | `INT 10H` (Video/character output), `INT 21H` (AH=01H read char, AH=02H write char, AH=09H print string, AH=0AH buffered input, AH=4CH exit process) |
| **Segment Overrides** | `CS:`, `DS:`, `ES:`, `SS:` |

---

## License

MIT
