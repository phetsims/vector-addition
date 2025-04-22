// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationTypeNode displays an interactive equation for one of the EquationType enumeration values.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorSymbolNode from '../../common/view/VectorSymbolNode.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import { EquationType } from '../model/EquationType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CoefficientPicker from './CoefficientPicker.js';

// constants
const TEXT_OPTIONS = {
  font: VectorAdditionConstants.INTERACTIVE_EQUATION_FONT
};
const labelNumberPickerSpacing = 7; // spacing between the NumberPicker and the VectorSymbolNode
const textSpacing = 13.5; // spacing between text of the equation

export default class EquationTypeNode extends Node {

  public constructor( vectorSet: EquationsVectorSet, equationType: EquationType, tandem: Tandem ) {

    // Create all pieces of the equation
    const equationChildren = [];
    let maxVectorSymbolHeight = 0;

    // Left side
    for ( let i = 0; i < vectorSet.vectors.length; i++ ) {

      if ( i > 0 ) {
        const signText = ( equationType === 'subtraction' ) ? MathSymbols.MINUS : MathSymbols.PLUS;
        equationChildren.push( new Text( signText, TEXT_OPTIONS ) );
      }

      const vector = vectorSet.equationsVectors[ i ];
      const vectorSymbol = vector.symbolProperty!.value;

      const coefficientPicker = new CoefficientPicker( vector.coefficientProperty, {
        color: vectorSet.vectorColorPalette.mainFill,
        tandem: tandem.createTandem( `${vectorSymbol}Picker` ),
        phetioVisiblePropertyInstrumented: false
      } );
      equationChildren.push( coefficientPicker );

      const vectorSymbolNode = new VectorSymbolNode( {
        symbolProperty: vector.symbolProperty,
        symbolFont: VectorAdditionConstants.INTERACTIVE_EQUATION_SYMBOL_FONT
      } );
      equationChildren.push( vectorSymbolNode );
      maxVectorSymbolHeight = Math.max( maxVectorSymbolHeight, vectorSymbolNode.height );
    }

    if ( equationType === 'negation' ) {
      equationChildren.push( new Text( MathSymbols.PLUS, TEXT_OPTIONS ) );

      const sumVector = vectorSet.sumVector!;
      assert && assert( sumVector );
      const vectorSymbolNode = new VectorSymbolNode( {
        symbolProperty: sumVector.symbolProperty,
        symbolFont: VectorAdditionConstants.INTERACTIVE_EQUATION_SYMBOL_FONT
      } );
      equationChildren.push( vectorSymbolNode );
      maxVectorSymbolHeight = Math.max( maxVectorSymbolHeight, vectorSymbolNode.height );
    }

    // =
    equationChildren.push( new Text( MathSymbols.EQUAL_TO, TEXT_OPTIONS ) );

    // Right side
    if ( equationType === 'negation' ) {
      equationChildren.push( new Text( '0', TEXT_OPTIONS ) );
    }
    else {
      const sumVector = vectorSet.sumVector!;
      assert && assert( sumVector );
      const vectorSymbolNode = new VectorSymbolNode( {
        symbolProperty: sumVector.symbolProperty,
        symbolFont: VectorAdditionConstants.INTERACTIVE_EQUATION_SYMBOL_FONT
      } );
      equationChildren.push( vectorSymbolNode );
      maxVectorSymbolHeight = Math.max( maxVectorSymbolHeight, vectorSymbolNode.height );
    }

    // This layout algorithm keeps text Nodes aligned on their baselines, and empirically adjusts the
    // vertical position of NumberPickers. See https://github.com/phetsims/vector-addition/issues/128
    for ( let i = 0; i < equationChildren.length; i++ ) {
      const child = equationChildren[ i ];
      if ( child instanceof NumberPicker ) {
        child.centerY = -maxVectorSymbolHeight / 3;
      }
      if ( i > 0 ) {
        const previousChild = equationChildren[ i - 1 ];
        if ( previousChild instanceof NumberPicker ) {
          child.left = previousChild.right + labelNumberPickerSpacing;
        }
        else {
          child.left = previousChild.right + textSpacing;
        }
      }
    }

    super( {
      children: equationChildren,
      isDisposable: false
    } );
  }
}

vectorAddition.register( 'EquationTypeNode', EquationTypeNode );