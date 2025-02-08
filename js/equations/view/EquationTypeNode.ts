// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationTypeNode displays an interactive equation for one of the EquationTypes enumeration values.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberPicker, { NumberPickerOptions } from '../../../../sun/js/NumberPicker.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorSymbolNode from '../../common/view/VectorSymbolNode.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import EquationTypes from '../model/EquationTypes.js';

// constants
const TEXT_OPTIONS = {
  font: VectorAdditionConstants.INTERACTIVE_EQUATION_FONT
};
const labelNumberPickerSpacing = 7; // spacing between the NumberPicker and the VectorSymbolNode
const textSpacing = 13.5; // spacing between text of the equation

export default class EquationTypeNode extends Node {

  public constructor( vectorSet: EquationsVectorSet, equationType: EquationTypes ) {

    // Create all pieces of the equation
    const equationChildren = [];
    let maxVectorSymbolHeight = 0;

    const numberPickerOptions = combineOptions<NumberPickerOptions>( {}, VectorAdditionConstants.NUMBER_PICKER_OPTIONS, {
      touchAreaXDilation: 20,
      touchAreaYDilation: 14,
      font: VectorAdditionConstants.INTERACTIVE_EQUATION_FONT,
      color: vectorSet.vectorColorPalette.mainFill
    } );

    // Left side
    for ( let i = 0; i < vectorSet.vectors.length; i++ ) {

      if ( i > 0 ) {
        const signText = ( equationType === EquationTypes.SUBTRACTION ) ? MathSymbols.MINUS : MathSymbols.PLUS;
        equationChildren.push( new Text( signText, TEXT_OPTIONS ) );
      }

      const vector = vectorSet.equationsVectors[ i ];

      assert && assert( vector.coefficientProperty.range,
        'coefficientProperty must have an associated range' );

      equationChildren.push( new NumberPicker( vector.coefficientProperty,
        new Property( vector.coefficientProperty.range ),
        numberPickerOptions ) );

      const vectorSymbolNode = new VectorSymbolNode( {
        symbolProperty: vector.symbolProperty,
        symbolFont: VectorAdditionConstants.INTERACTIVE_EQUATION_SYMBOL_FONT
      } );
      equationChildren.push( vectorSymbolNode );
      maxVectorSymbolHeight = Math.max( maxVectorSymbolHeight, vectorSymbolNode.height );
    }

    if ( equationType === EquationTypes.NEGATION ) {
      const signText = ( equationType === EquationTypes.SUBTRACTION ) ? MathSymbols.MINUS : MathSymbols.PLUS;
      equationChildren.push( new Text( signText, TEXT_OPTIONS ) );

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

    // Right size
    if ( equationType === EquationTypes.NEGATION ) {
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