// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationTypeNode displays an interactive equation for one of the EquationTypes enumeration values.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorSymbolNode from '../../common/view/VectorSymbolNode.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import EquationTypes from '../model/EquationTypes.js';

// constants
const TEXT_OPTIONS = {
  font: VectorAdditionConstants.INTERACTIVE_EQUATION_FONT
};

export default class EquationTypeNode extends Node {

  /**
   * @param {EquationsVectorSet} vectorSet
   * @param {EquationTypes} equationType
   * @param {Object} [options]
   */
  constructor( vectorSet, equationType, options ) {

    assert && assert( vectorSet instanceof EquationsVectorSet, `invalid vectorSet: ${vectorSet}` );
    assert && assert( EquationTypes.enumeration.includes( equationType ), `invalid equationType: ${equationType}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {

      // {number} spacing between the NumberPicker and the VectorSymbolNode
      labelNumberPickerSpacing: 7,

      // {number} spacing between text of the equation
      textSpacing: 13.5,

      // {number} align width of the sign texts (ie. '+', '-'). The 'sign' text is
      // aligned in an AlignBox to ensure that they are the same width.
      signTextWidth: 4

    }, options );

    // Create all of the pieces of the equation
    const equationChildren = [];
    let maxVectorSymbolHeight = 0;

    const numberPickerOptions = merge( {}, VectorAdditionConstants.NUMBER_PICKER_OPTIONS, {
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

      const vector = vectorSet.vectors.get( i );

      assert && assert( vector.coefficientProperty.range,
        'coefficientProperty must have an associated range' );

      equationChildren.push( new NumberPicker( vector.coefficientProperty,
        new Property( vector.coefficientProperty.range ),
        numberPickerOptions ) );

      const vectorSymbolNode = new VectorSymbolNode( {
        symbol: vector.symbol,
        symbolFont: VectorAdditionConstants.INTERACTIVE_EQUATION_SYMBOL_FONT
      } );
      equationChildren.push( vectorSymbolNode );
      maxVectorSymbolHeight = Math.max( maxVectorSymbolHeight, vectorSymbolNode.height );
    }

    if ( equationType === EquationTypes.NEGATION ) {
      const signText = ( equationType === EquationTypes.SUBTRACTION ) ? MathSymbols.MINUS : MathSymbols.PLUS;
      equationChildren.push( new Text( signText, TEXT_OPTIONS ) );

      const vectorSymbolNode = new VectorSymbolNode( {
        symbol: vectorSet.sumVector.symbol,
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
      const vectorSymbolNode = new VectorSymbolNode( {
        symbol: vectorSet.sumVector.symbol,
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
          child.left = previousChild.right + options.labelNumberPickerSpacing;
        }
        else {
          child.left = previousChild.right + options.textSpacing;
        }
      }
    }

    assert && assert( !options.children, 'EquationTypeNode sets children' );
    options.children = equationChildren;

    super( options );
  }
}

vectorAddition.register( 'EquationTypeNode', EquationTypeNode );